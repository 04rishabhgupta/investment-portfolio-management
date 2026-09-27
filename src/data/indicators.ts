import { Severity, Startup, MonthlySnapshot } from '@/types';
import { differenceInMonths, differenceInDays } from 'date-fns';
import { getDemoDate } from '@/lib/clock';

export interface EvaluationContext {
  startup: Startup;
  snapshot: MonthlySnapshot;
  prevSnapshot?: MonthlySnapshot;
}

export interface Indicator {
  id: string;
  category: string;
  label: string;
  severity: Severity;
  slaHours: number;
  pmOnly?: boolean;
  check?: (ctx: EvaluationContext) => boolean;
  action: string;
}

export const indicators: Indicator[] = [
  {
    id: 'F1', category: 'FINANCIAL', label: 'Runway <6 months, no active grant or raise',
    severity: 'AMBER', slaHours: 48, action: 'Start Cash Runway Crisis Playbook',
    check: (ctx) => ctx.snapshot.runwayMonths < 6 && !ctx.snapshot.activeGrantOrRaise
  },
  {
    id: 'F2', category: 'FINANCIAL', label: 'Runway <3 months',
    severity: 'RED', slaHours: 24, action: 'Start Cash Runway Crisis Playbook',
    check: (ctx) => ctx.snapshot.runwayMonths < 3
  },
  {
    id: 'F3', category: 'FINANCIAL', label: 'Burn up >20% without milestone achieved',
    severity: 'AMBER', slaHours: 72, action: 'Start Cash Runway Crisis Playbook',
    check: (ctx) => {
      if (!ctx.prevSnapshot) return false;
      const burnIncrease = (ctx.snapshot.monthlyBurn - ctx.prevSnapshot.monthlyBurn) / (ctx.prevSnapshot.monthlyBurn || 1);
      return burnIncrease > 0.20 && ctx.snapshot.milestonesDelivered === 0;
    }
  },
  {
    id: 'F4', category: 'FINANCIAL', label: 'Spend disconnected from milestones',
    severity: 'AMBER', slaHours: 168, action: 'Spend Audit',
    check: (ctx) => {
      const msSpend = ctx.snapshot.spendLines.reduce((acc, l) => acc + (l.milestoneLinked ? l.amount : 0), 0);
      return msSpend / (ctx.snapshot.monthlyBurn || 1) < 0.6;
    }
  },
  {
    id: 'F5', category: 'FINANCIAL', label: 'Grant dependency >80%, no commercial path at 18+ months',
    severity: 'AMBER', slaHours: 168, action: 'Go-to-market review',
    check: (ctx) => ctx.startup.grantDependencyPct > 80 && ctx.startup.monthsOperating >= 18 && ['NONE', 'INTEREST'].includes(ctx.startup.commercialSignal)
  },
  {
    id: 'F6', category: 'FINANCIAL', label: 'Founder salaries depleting grant capital',
    severity: 'AMBER', slaHours: 168, action: 'Salary & Spend Audit',
    check: (ctx) => ctx.snapshot.founderSalaryShareOfBurn > 50
  },
  {
    id: 'T1', category: 'TECH', label: 'TRL unchanged 3 months',
    severity: 'AMBER', slaHours: 336, action: 'Technical review',
    check: (ctx) => {
      const m = differenceInMonths(getDemoDate(), new Date(ctx.startup.trlLastChanged));
      return m >= 3 && m < 6;
    }
  },
  {
    id: 'T2', category: 'TECH', label: 'TRL unchanged 6 months',
    severity: 'RED', slaHours: 168, action: 'Start Tech Stall Playbook',
    check: (ctx) => differenceInMonths(getDemoDate(), new Date(ctx.startup.trlLastChanged)) >= 6
  },
  { id: 'T3', category: 'TECH', label: 'Founder avoids technical discussion', severity: 'AMBER', slaHours: 48, pmOnly: true, action: 'Discuss in 1-1' },
  { id: 'T4', category: 'TECH', label: 'Repeated technical failure, no change in approach', severity: 'AMBER', slaHours: 168, pmOnly: true, action: 'Start Tech Stall Playbook' },
  {
    id: 'T5', category: 'TECH', label: 'IP ownership unclear',
    severity: 'RED', slaHours: 24, action: 'Legal review',
    check: (ctx) => !ctx.startup.ip.ownershipClear
  },
  {
    id: 'T6', category: 'TECH', label: 'Key technical co-founder departs',
    severity: 'RED', slaHours: 24, action: 'Intervention',
    // Mock check: in a real system we'd detect the edge, here we just check state
    check: (ctx) => ctx.startup.founders.some(f => f.isTechnical && !f.active)
  },
  {
    id: 'D1', category: 'DISCOVERY', label: 'Zero user conversations in 4 weeks',
    severity: 'AMBER', slaHours: 72, action: 'PMF Diagnostic',
    check: (ctx) => ctx.snapshot.userConversations === 0
  },
  {
    id: 'D2', category: 'DISCOVERY', label: 'Cannot name 5 validators',
    severity: 'AMBER', slaHours: 168, action: 'Discovery sprint',
    check: (ctx) => ctx.snapshot.validatedContacts < 5
  },
  {
    id: 'D3', category: 'DISCOVERY', label: 'All discovery feedback positive',
    severity: 'AMBER', slaHours: 336, action: 'Red-team product',
    check: (ctx) => ctx.snapshot.negativeFeedbackCount === 0 && ctx.snapshot.userConversations >= 10 // simplified 3m logic
  },
  {
    id: 'D4', category: 'DISCOVERY', label: 'Working on 3+ problems',
    severity: 'AMBER', slaHours: 72, action: 'Focus session',
    check: (ctx) => ctx.startup.activeProblems >= 3
  },
  {
    id: 'D5', category: 'DISCOVERY', label: 'No defined ICP after 6+ months',
    severity: 'RED', slaHours: 168, action: 'ICP workshop',
    check: (ctx) => !ctx.startup.icpDefined && ctx.startup.monthsOperating >= 6
  },
  { id: 'D6', category: 'DISCOVERY', label: 'Features added without user validation', severity: 'AMBER', slaHours: 168, pmOnly: true, action: 'PMF Diagnostic' },
  {
    id: 'P1', category: 'PEOPLE', label: 'No founder response 10+ days',
    severity: 'AMBER', slaHours: 48, action: 'Dormancy watch',
    check: (ctx) => differenceInDays(getDemoDate(), new Date(ctx.startup.lastFounderContact)) >= 10
  },
  { id: 'P2', category: 'PEOPLE', label: 'Founder considering other jobs', severity: 'RED', slaHours: 8, pmOnly: true, action: 'Emergency 1-1' },
  {
    id: 'P3', category: 'PEOPLE', label: 'Team drops from 3 to 1',
    severity: 'RED', slaHours: 24, action: 'Retention crisis playbook',
    check: (ctx) => ctx.startup.founders.filter(f => f.active).length === 1 && ctx.startup.founders.length >= 3
  },
  { id: 'P4', category: 'PEOPLE', label: 'Co-founder conflict affecting operations', severity: 'AMBER', slaHours: 48, pmOnly: true, action: 'Co-founder mediation' },
  {
    id: 'P5', category: 'PEOPLE', label: 'Wellbeing score below 6',
    severity: 'AMBER', slaHours: 168, action: 'Check-in on wellbeing',
    check: (ctx) => (ctx.startup.wellbeingScore || 10) < 6
  },
  { id: 'P6', category: 'PEOPLE', label: 'Attributing all problems to external causes', severity: 'AMBER', slaHours: 72, pmOnly: true, action: 'Coaching' },
  { id: 'S1', category: 'STRATEGY', label: 'Problem statement changed with no documented learning', severity: 'AMBER', slaHours: 168, pmOnly: true, action: 'Review pivot' },
  {
    id: 'S2', category: 'STRATEGY', label: '3+ investor rejections, no narrative change',
    severity: 'AMBER', slaHours: 336, action: 'Fundraising Playbook',
    check: (ctx) => ctx.snapshot.investorRejectionsSinceNarrativeChange >= 3
  },
  { id: 'S3', category: 'STRATEGY', label: 'Regulatory action or government notice', severity: 'RED', slaHours: 24, pmOnly: true, action: 'Legal review' },
  { id: 'S4', category: 'STRATEGY', label: 'Equity changed without informing incubator', severity: 'RED', slaHours: 24, pmOnly: true, action: 'Compliance check' },
  { id: 'S5', category: 'STRATEGY', label: 'Grant funds used inconsistently with objectives', severity: 'RED', slaHours: 24, pmOnly: true, action: 'Financial audit' },
  {
    id: 'M1-REG', category: 'MEDTECH', label: 'Regulatory gap at TRL 4+',
    severity: 'AMBER', slaHours: 168, action: 'Regulatory Strategy Session',
    check: (ctx) => ctx.startup.sector === 'MEDTECH_BIOTECH' && ctx.startup.trl >= 4 && ['B', 'C', 'D'].includes(ctx.startup.medtechDeviceClass || '') && !ctx.startup.regulatoryPreSubDone
  }
];
