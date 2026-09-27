export type Stage =
  | 'PRE_INCUBATION'
  | 'EARLY_INCUBATION'
  | 'MID_INCUBATION'
  | 'LATE_INCUBATION'
  | 'ACCELERATION'
  | 'INVESTMENT_PORTFOLIO'
  | 'GRADUATION'
  | 'DORMANT'
  | 'WIND_DOWN';

export type Sector =
  | 'AI_ML'
  | 'MEDTECH_BIOTECH'
  | 'AGRITECH'
  | 'CYBERSECURITY'
  | 'UAV_AUTONOMOUS'
  | 'SEMICONDUCTOR_HARDWARE';

export type EvidenceType =
  | 'SIMULATION'
  | 'LAB_PROTOTYPE'
  | 'RELEVANT_ENVIRONMENT'
  | 'REAL_USERS'
  | 'QUALIFIED'
  | 'COMMERCIAL';

export type Band = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'CRITICAL';
export type Severity = 'AMBER' | 'RED';

export type Archetype =
  | 'SCIENTIST'
  | 'ENGINEER_PERFECTIONIST'
  | 'VISIONARY'
  | 'PROBLEM_OBSESSED'
  | 'ACADEMIC_HEDGER'
  | 'SERIAL_LEARNER'
  | 'TECH_COMMERCIAL_HYBRID';

export type PMMode = 'COACH' | 'ADVISOR' | 'FIREFIGHTER' | 'WITNESS';

export type Dimension = 
  | 'TECH'
  | 'TEAM'
  | 'DISCOVERY'
  | 'CASH'
  | 'EXECUTION'
  | 'IP'
  | 'ENGAGEMENT'
  | 'REVENUE';

export type IndicatorId = string;
export type PlaybookId = string;
export type Role = 'PM' | 'SENIOR_PM' | 'PROGRAM_HEAD' | 'FOUNDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: Role;
  assignedStartupId?: string; // For founders
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  fullTime: boolean;
  isTechnical: boolean;
  active: boolean;
}

export interface Startup {
  id: string;
  name: string;
  oneLiner: string;
  sector: Sector;
  stage: Stage;
  cohort: string;
  pmId: string;
  archetype: Archetype;
  trl: number;
  trlEvidence: EvidenceType;
  trlVerified: boolean;
  trlLastChanged: string;
  founders: Founder[];
  ip: {
    status: 'NONE' | 'TRADE_SECRET' | 'FILED' | 'GRANTED';
    ownershipClear: boolean;
  };
  icpDefined: boolean;
  activeProblems: number;
  monthsOperating: number;
  grantDependencyPct: number;
  commercialSignal: 'NONE' | 'INTEREST' | 'PILOT_LOI' | 'PAYING';
  lastFounderContact: string;
  lastActivity: string;
  wellbeingScore?: number;
  medtechDeviceClass?: 'A' | 'B' | 'C' | 'D';
  regulatoryPreSubDone?: boolean;
}

export interface MonthlySnapshot {
  id: string;
  startupId: string;
  month: string; // YYYY-MM
  cashBalance: number;
  monthlyBurn: number;
  runwayMonths: number;
  spendLines: { item: string; amount: number; milestoneLinked: boolean }[];
  userConversations: number;
  negativeFeedbackCount: number;
  validatedContacts: number;
  milestonesCommitted: number;
  milestonesDelivered: number;
  activeGrantOrRaise: boolean;
  founderSalaryShareOfBurn: number;
  investorRejectionsSinceNarrativeChange: number;
  mentorSessionsLast90d: number;
  submittedOn?: string;
}

export interface HealthScore {
  id: string;
  startupId: string;
  month: string; // YYYY-MM
  profile: 'PRE_REVENUE' | 'ACCELERATION';
  suggested: Record<Dimension, number>;
  confirmed?: Record<Dimension, number>;
  overrides: { dimension: Dimension; from: number; to: number; reason: string }[];
  total: number;
  delta3m: number;
  band: Band;
  confirmedBy?: string;
  confirmedOn?: string;
}

export interface MeetingNote {
  wins: string[];
  challenges: string[];
  dataUpdate: string;
  commitments: { owner: string; text: string; due: string }[];
  pmSignals: string;
  softFlagsTicked: IndicatorId[];
  writtenOn: string;
}

export interface Meeting {
  id: string;
  startupId: string;
  type: 'WEEKLY' | 'MONTHLY' | 'QBR' | 'EMERGENCY' | 'FINAL';
  date: string;
  attendees: string[];
  prepBrief?: string;
  note?: MeetingNote;
  recapSentOn?: string;
}

export interface Action {
  id: string;
  startupId: string;
  owner: string;
  text: string;
  due: string;
  status: 'OPEN' | 'DONE' | 'MISSED';
  source: string;
}

export interface RiskFlag {
  id: string;
  startupId: string;
  indicatorId: IndicatorId;
  severity: Severity;
  raisedOn: string;
  slaDue: string;
  escalationLevel: 0 | 1 | 2;
  status: 'OPEN' | 'IN_DIAGNOSTIC' | 'IN_INTERVENTION' | 'RESOLVED' | 'DISMISSED';
  source: 'RULE' | 'PM' | 'AI_SUGGESTED';
  evidence: string;
}

export interface Intervention {
  id: string;
  startupId: string;
  flagId?: string;
  playbook: PlaybookId;
  rootCause?: string;
  tasks: { day: string; action: string; owner: string; done: boolean }[];
  outcome?: string;
  closedOn?: string;
}

export interface GateRequest {
  id: string;
  startupId: string;
  from: Stage;
  to: Stage;
  evidence: { item: string; met: boolean; attachment?: string }[];
  approverRole: Role;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'RETURNED';
  decisionNote?: string;
}

export interface SectorBrief {
  id: string;
  startupId: string;
  sector: Sector;
  steps: [BriefStep, BriefStep, BriefStep, BriefStep, BriefStep, BriefStep];
  recommendation?: 'INVEST' | 'HOLD' | 'SUPPORT' | 'PASS';
}

export interface BriefStep {
  stepNo: number;
  title: string;
  sections: { 
    heading: string; 
    body: string; 
    claims: { text: string; tag: 'FACT' | 'ESTIMATE' | 'ASSUMPTION'; source?: string }[] 
  }[];
  evidenceChecklist: { item: string; verified: boolean }[];
  redFlags: { text: string; present: boolean }[];
  status: 'NOT_STARTED' | 'DRAFT' | 'VERIFIED';
}

export type MCSector = 
  | 'AgriTech' 
  | 'AI/ML' 
  | 'Healthcare' 
  | 'Cybersecurity' 
  | 'DeepTech' 
  | 'Defence' 
  | 'Sustainability' 
  | 'Green Mobility' 
  | 'Fintech' 
  | 'EdTech' 
  | 'Other';

export type MCExpertise = 
  | 'Fundraising' 
  | 'Technology / Product' 
  | 'Go-to-Market' 
  | 'B2B Sales' 
  | 'Regulatory & Compliance' 
  | 'IP & Patents' 
  | 'Marketing' 
  | 'Product Strategy' 
  | 'Strategic Partnerships' 
  | 'Government Contracts' 
  | 'Supply Chain' 
  | 'ESG & Impact' 
  | 'Clinical Strategy' 
  | 'Legal' 
  | 'HR & Talent' 
  | 'Financial Modelling';

export type MCStage = 'Ideation' | 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B+';

export interface Mentor {
  id: string;
  name: string;
  title: string;
  phone: string;
  linkedin: string;
  sectors: MCSector[];
  expertise: MCExpertise[];
  stages: MCStage[];
  geography: string;
  availability: 'LOW' | 'MEDIUM' | 'HIGH';
  maxActiveMatches: number;
  bio: string;
  trlBand?: [number, number];
}

export interface MatchRequest {
  id: string;
  startupId: string;
  challenge: string;
  expertiseNeeded: MCExpertise[];
  source: 'FOUNDER' | 'SYSTEM_TRIGGER';
  triggerFlagId?: string;
  rankedMentors?: { mentorId: string; score: number; reasoning: string }[];
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED';
}

export interface Match {
  id: string;
  requestId: string;
  startupId: string;
  mentorId: string;
  confirmedBy: string;
  confirmedOn: string;
  sessions: { date: string; topic: string; nextStep: string; founderRating?: number; mentorRating?: number }[];
  status: 'ACTIVE' | 'CLOSED';
}

export interface Pattern {
  id: string;
  signal: string;
  rootCause: string;
  intervention: string;
  outcome: string;
  sector: Sector;
  stage: Stage;
  startupId: string;
}
