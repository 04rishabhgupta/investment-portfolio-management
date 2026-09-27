export interface Playbook {
  id: string;
  name: string;
  triggers: string[]; // indicator IDs
  rootCauses: string[];
  generateTasks: (rootCause: string, startupId: string) => any[];
}

export const playbooks: Playbook[] = [
  {
    id: 'PB_CASH',
    name: 'Cash Runway Crisis',
    triggers: ['F1', 'F2', 'F3'],
    rootCauses: [
      'Expected revenue did not arrive',
      'Burn accelerated',
      'Grant approved but not disbursed',
      'Fundraising slipped',
      'Planned spend (not a crisis)'
    ],
    generateTasks: (cause, startupId) => {
      const isGrantDelay = cause === 'Grant approved but not disbursed';
      
      const tasks = [
        { day: '1', action: 'Emergency session: exact cash/burn/runway, notify Senior PM', owner: 'PM', done: false },
      ];

      if (isGrantDelay) {
        tasks.push({ day: '2', action: 'Spend audit: essential/deferrable/cancel', owner: 'Founder', done: false });
        tasks.push({ day: '3', action: 'Escalate to granting agency', owner: 'PROGRAM_HEAD', done: false });
      } else {
        tasks.push({ day: '2', action: 'Spend audit: essential/deferrable/cancel', owner: 'PM', done: false });
        tasks.push({ day: '3', action: 'Three warm investor/funder intros', owner: 'PM', done: false });
        tasks.push({ day: '7', action: 'Revenue bridge, early-pay or pilot pull-forward', owner: 'Founder', done: false });
      }

      tasks.push({ day: '30', action: 'Status review', owner: 'PM', done: false });
      
      if (!isGrantDelay) {
        tasks.push({ day: '60', action: 'Path-forward conversation if no improvement', owner: 'SENIOR_PM', done: false });
      }

      return tasks;
    }
  },
  {
    id: 'PB_TECH',
    name: 'Technology Development Stall',
    triggers: ['T1', 'T2', 'T4'],
    rootCauses: [
      'Wrong approach',
      'Missing equipment/access',
      'Skills gap',
      'Fear of results',
      'Regulatory/IP constraint'
    ],
    generateTasks: (cause, startupId) => {
      return [
        { day: '7', action: 'Independent technical review', owner: 'PM', done: false },
        { day: '14', action: 'Document two alternative approaches', owner: 'Founder', done: false },
        { day: '21', action: 'One experiment with written success/failure criteria', owner: 'Founder', done: false },
        { day: '30', action: 'Experiment review', owner: 'PM', done: false },
        { day: '60', action: 'TRL assessment with evidence', owner: 'PM', done: false },
        { day: '90', action: 'Progress review or pivot conversation', owner: 'PM', done: false },
      ];
    }
  }
];
