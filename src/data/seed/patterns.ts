import { Pattern } from '@/types';

export const seededPatterns: Pattern[] = [
  {
    id: 'p1',
    signal: 'Extended grant disbursement delays (>2 quarters)',
    rootCause: 'Agency-level budget reallocations at DST/BIRAC',
    intervention: 'Bridge financing via internal seed fund; pivot to private grants',
    outcome: 'Prevented critical talent churn in 80% of affected startups',
    sector: 'MEDTECH_BIOTECH',
    stage: 'MID_INCUBATION',
    startupId: 's5'
  },
  {
    id: 'p2',
    signal: 'Burn rate spiking >30% post product-launch',
    rootCause: 'Underestimated customer acquisition cost (CAC) and marketing overhead',
    intervention: 'Mandatory GTM strategy review and freeze on unverified ad spend',
    outcome: 'Burn normalized within 2 months, CAC reduced by 40%',
    sector: 'AI_ML',
    stage: 'EARLY_INCUBATION',
    startupId: 's3'
  }
];
