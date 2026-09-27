import { GateRequest } from '@/types';

export const seededGateRequests: GateRequest[] = [
  {
    id: 'gr1',
    startupId: 's5', // Sanjeevani Diagnostics (MID_INCUBATION -> LATE_INCUBATION)
    from: 'MID_INCUBATION',
    to: 'LATE_INCUBATION',
    evidence: [
      { item: 'Validated closer to real-world use', met: true, attachment: 'trial_protocol.pdf' },
      { item: 'TRL >= 6', met: true, attachment: 'trl_assessment_v2.pdf' },
      { item: 'At least one user willing to pilot', met: false },
      { item: 'Team still complete', met: true }
    ],
    approverRole: 'PROGRAM_HEAD',
    status: 'PENDING'
  }
];
