import { SectorBrief } from '@/types';

export const seededBriefs: SectorBrief[] = [
  {
    id: 'b1',
    startupId: 's5',
    sector: 'MEDTECH_BIOTECH',
    recommendation: 'SUPPORT',
    steps: [
      {
        stepNo: 1,
        title: 'Technology & Clinical Need',
        sections: [
          {
            heading: 'Core Technology',
            body: 'Portable point-of-care PCR diagnostics platform.',
            claims: [
              { text: 'Reduces testing time by 60%', tag: 'FACT', source: 'Phase 1 Clinical Trial' },
              { text: 'Estimated BOM < $50', tag: 'ESTIMATE' }
            ]
          }
        ],
        evidenceChecklist: [{ item: 'Peer-reviewed validation', verified: true }],
        redFlags: [{ text: 'No IP filed', present: false }],
        status: 'VERIFIED'
      },
      {
        stepNo: 2,
        title: 'Regulatory Pathway',
        sections: [
          {
            heading: 'CDSCO / FDA Clearance',
            body: 'Class B medical device requiring clinical validation.',
            claims: [
              { text: 'Requires 500 patient multi-centric study', tag: 'ASSUMPTION' }
            ]
          }
        ],
        evidenceChecklist: [{ item: 'Regulatory consultant hired', verified: false }],
        redFlags: [{ text: 'Timeline > 2 years', present: true }],
        status: 'DRAFT'
      },
      { stepNo: 3, title: 'Market & Competition', sections: [], evidenceChecklist: [], redFlags: [], status: 'NOT_STARTED' },
      { stepNo: 4, title: 'Business Model', sections: [], evidenceChecklist: [], redFlags: [], status: 'NOT_STARTED' },
      { stepNo: 5, title: 'Team & Execution', sections: [], evidenceChecklist: [], redFlags: [], status: 'NOT_STARTED' },
      { stepNo: 6, title: 'Financials & Deal', sections: [], evidenceChecklist: [], redFlags: [], status: 'NOT_STARTED' }
    ]
  }
];
