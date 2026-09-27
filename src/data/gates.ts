import { Stage, Role } from '@/types';

export interface GateRule {
  from: Stage;
  to: Stage;
  approverRole: Role | Role[];
  checklist: string[];
}

export const gates: GateRule[] = [
  {
    from: 'PRE_INCUBATION',
    to: 'EARLY_INCUBATION',
    approverRole: ['SENIOR_PM', 'PROGRAM_HEAD'],
    checklist: [
      '50+ documented problem conversations',
      'Evidence-backed problem statement',
      'Initial prototype plan',
      'Full founding team full-time'
    ]
  },
  {
    from: 'EARLY_INCUBATION',
    to: 'MID_INCUBATION',
    approverRole: ['PM', 'SENIOR_PM'], // Represents PM + Senior PM review
    checklist: [
      'Working PoC with documented test results',
      'TRL >= 4',
      'Regular user conversations continuing'
    ]
  },
  {
    from: 'MID_INCUBATION',
    to: 'LATE_INCUBATION',
    approverRole: ['PM', 'PROGRAM_HEAD'],
    checklist: [
      'Validated closer to real-world use',
      'TRL >= 6',
      'At least one user willing to pilot',
      'Team still complete'
    ]
  },
  {
    from: 'LATE_INCUBATION',
    to: 'ACCELERATION',
    approverRole: ['SENIOR_PM', 'PROGRAM_HEAD'],
    checklist: [
      'At least one paying customer or signed pilot LoI',
      'TRL >= 6',
      'Commercial co-founder identified',
      '6+ months runway'
    ]
  },
  {
    from: 'ACCELERATION',
    to: 'GRADUATION',
    approverRole: 'PROGRAM_HEAD', // And Leadership, but simplified for app
    checklist: [
      'Clear revenue path or institutional investment',
      'Team can operate independently',
      'All obligations settled'
    ]
  }
];
