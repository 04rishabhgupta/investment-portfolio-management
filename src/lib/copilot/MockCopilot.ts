import { CopilotContextType } from './CopilotProvider';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const MockCopilot: CopilotContextType = {
  async draftMeetingNote(transcript: string) {
    await delay(1200);
    // Simple deterministic mock based on prompt text
    if (transcript.includes('hospital job offer')) {
      return {
        wins: ['Completed 6 conversations this month'],
        challenges: ['Cash runway is getting tight', 'Personal motivation / burnout risk'],
        dataUpdate: 'Cash: ₹22 L, Burn: ₹7.8 L/m (Runway: 2.8m)',
        commitments: [
          { owner: 'Founder', text: 'Follow up with granting agency', due: '2026-10-10' },
          { owner: 'PM', text: 'Check regulatory fast-track options', due: '2026-10-07' }
        ],
        suggestedSoftFlags: ['P2']
      };
    }
    
    return {
      wins: ['Good progress on core features'],
      challenges: ['Hiring is slow'],
      dataUpdate: 'No major changes',
      commitments: [{ owner: 'Founder', text: 'Submit next month update', due: '2026-11-01' }],
      suggestedSoftFlags: []
    };
  },

  async draftSectorBriefStep(stepNo: number, startupContext: any) {
    await delay(1500);
    return {
      stepNo,
      drafted: true,
      content: `Simulated drafted content for step ${stepNo} based on ${startupContext?.sector || 'sector'}`
    };
  },

  async generateQuestions(context: any) {
    await delay(800);
    return [
      "What is the biggest technical blocker right now?",
      "How are you managing the team's morale?",
      "Who is your next key hire?"
    ];
  }
};
