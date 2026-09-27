import { Startup, Dimension, Band, MonthlySnapshot, RiskFlag } from '@/types';
import { differenceInMonths } from 'date-fns';
import { getDemoDate } from '../clock';

const PRE_REVENUE_WEIGHTS: Record<Dimension, number> = {
  TECH: 0.25,
  TEAM: 0.20,
  DISCOVERY: 0.15,
  CASH: 0.15,
  EXECUTION: 0.10,
  IP: 0.07,
  ENGAGEMENT: 0.05,
  REVENUE: 0.03,
};

const ACCELERATION_WEIGHTS: Record<Dimension, number> = {
  TECH: 0.15,
  TEAM: 0.15,
  DISCOVERY: 0.08,
  CASH: 0.10,
  EXECUTION: 0.10,
  IP: 0.10,
  ENGAGEMENT: 0.02,
  REVENUE: 0.30,
};

function clamp(val: number): number {
  return Math.max(0, Math.min(100, val));
}

const expectedTRLByStage: Record<string, number> = {
  PRE_INCUBATION: 1,
  EARLY_INCUBATION: 3,
  MID_INCUBATION: 5,
  LATE_INCUBATION: 6,
  ACCELERATION: 7,
  INVESTMENT_PORTFOLIO: 7,
  GRADUATION: 8,
};

export function calculateSuggestedScores(
  startup: Startup, 
  snapshot: MonthlySnapshot, 
  flags: RiskFlag[]
): Record<Dimension, number> {
  const scores = {} as Record<Dimension, number>;
  const demoToday = getDemoDate();

  // TECH
  const expected = expectedTRLByStage[startup.stage] || 1;
  const monthsSinceTRLChange = differenceInMonths(demoToday, new Date(startup.trlLastChanged));
  scores.TECH = 60 + 10 * (startup.trl - expected) - 8 * Math.max(0, monthsSinceTRLChange - 2) + (startup.trlVerified ? 10 : -10);

  // TEAM
  let teamScore = 90;
  if (startup.founders.some(f => f.active && !f.fullTime)) teamScore -= 25;
  if (flags.some(f => f.indicatorId === 'P4' && f.status === 'OPEN')) teamScore -= 20;
  // Note: simplified team shrank check - would need historical data ideally
  if (startup.stage === 'LATE_INCUBATION' || startup.stage === 'ACCELERATION' || startup.stage === 'INVESTMENT_PORTFOLIO' || startup.stage === 'GRADUATION') {
    if (!startup.founders.some(f => f.active && !f.isTechnical)) teamScore -= 15;
  }
  if (startup.wellbeingScore && startup.wellbeingScore < 7) {
    teamScore -= 5 * (7 - startup.wellbeingScore);
  }
  scores.TEAM = teamScore;

  // DISCOVERY
  let discScore = 25;
  if (snapshot.userConversations >= 5) discScore = 85;
  else if (snapshot.userConversations >= 2) discScore = 60;
  
  if (startup.icpDefined) discScore += 10;
  if (['PILOT_LOI', 'PAYING'].includes(startup.commercialSignal)) discScore += 5;
  if (snapshot.negativeFeedbackCount === 0 && snapshot.userConversations >= 10) discScore -= 15; // approximate 3-month logic
  scores.DISCOVERY = discScore;

  // CASH
  let cashScore = 20;
  if (snapshot.runwayMonths >= 12) cashScore = 90;
  else if (snapshot.runwayMonths >= 6) cashScore = 70;
  else if (snapshot.runwayMonths >= 3) cashScore = 45;
  
  // burn up 20% would need prev snapshot, assume passed or mocked
  const milestoneSpendPct = (snapshot.spendLines || []).reduce((acc, line) => acc + (line.milestoneLinked ? line.amount : 0), 0) / (snapshot.monthlyBurn || 1);
  if (milestoneSpendPct < 0.6) cashScore -= 10;
  scores.CASH = cashScore;

  // EXECUTION
  let execScore = 40;
  const deliveryRate = snapshot.milestonesDelivered / (snapshot.milestonesCommitted || 1);
  if (deliveryRate >= 0.8) execScore = 85;
  else if (deliveryRate >= 0.6) execScore = 65;
  scores.EXECUTION = execScore;

  // IP
  let ipScore = 40;
  if (startup.ip.status === 'GRANTED') ipScore = 90;
  else if (startup.ip.status === 'FILED') ipScore = 80;
  else if (startup.ip.status === 'TRADE_SECRET') ipScore = 65;
  if (!startup.ip.ownershipClear) ipScore = 20;
  scores.IP = ipScore;

  // ENGAGEMENT
  let engScore = 40;
  if (snapshot.mentorSessionsLast90d >= 3) engScore = 85;
  else if (snapshot.mentorSessionsLast90d >= 1) engScore = 65;
  scores.ENGAGEMENT = engScore;

  // REVENUE
  let revScore = 20;
  if (startup.commercialSignal === 'PAYING') revScore = 90;
  else if (startup.commercialSignal === 'PILOT_LOI') revScore = 70;
  else if (startup.commercialSignal === 'INTEREST') revScore = 45;
  scores.REVENUE = revScore;

  // Clamp all
  for (const dim in scores) {
    scores[dim as Dimension] = clamp(scores[dim as Dimension]);
  }

  return scores;
}

export function calculateTotalScore(scores: Record<Dimension, number>, profile: 'PRE_REVENUE' | 'ACCELERATION'): number {
  const weights = profile === 'PRE_REVENUE' ? PRE_REVENUE_WEIGHTS : ACCELERATION_WEIGHTS;
  let total = 0;
  for (const dim in weights) {
    total += scores[dim as Dimension] * weights[dim as Dimension];
  }
  return Math.round(total);
}

export function getBand(score: number): Band {
  if (score >= 75) return 'HEALTHY';
  if (score >= 55) return 'WATCH';
  if (score >= 35) return 'AT_RISK';
  return 'CRITICAL';
}

export function calculateRank(total: number, delta3m: number, openRedFlags: number, openAmberFlags: number): number {
  return (100 - total) + 1.5 * Math.max(0, -delta3m) + 20 * openRedFlags + 8 * openAmberFlags;
}
