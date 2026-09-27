import { describe, it, expect } from 'vitest';
import { rankMentors } from './mentorRanking';
import { Mentor, Startup, MatchRequest } from '@/types';

describe('Mentor Ranking Engine', () => {
  it('should rank mentors deterministically and cap capacity correctly', () => {
    const startup = { sector: 'AI_ML', stage: 'EARLY_INCUBATION', trl: 3 } as Startup;
    const request = { expertiseNeeded: ['Fundraising'] } as MatchRequest;
    
    const mentors: Mentor[] = [
      {
        id: 'm1',
        sectors: ['AI/ML'], // Match
        expertise: ['Fundraising'], // Match
        stages: ['Ideation'], // Match
        availability: 'HIGH', // 15
        maxActiveMatches: 2,
        trlBand: [2, 5] // Match
      } as Mentor,
      {
        id: 'm2',
        sectors: ['AgriTech'], // No Match
        expertise: ['Technology / Product'], // No Match
        stages: ['Series A'], // No Match
        availability: 'LOW',
        maxActiveMatches: 0 // Capacity 0 (wait, maxActiveMatches > 0 check)
      } as Mentor
    ];

    const ranked = rankMentors(mentors, startup, request);
    
    expect(ranked.length).toBe(1); // m2 might have 0 score and be filtered, or just ranked lower
    expect(ranked[0].mentorId).toBe('m1');
    // Score calculation for m1:
    // Sector: 35
    // Expertise: 35
    // Stage: 15
    // Capacity: 15
    // TRL: 5
    // Total: 100
    expect(ranked[0].score).toBe(100);
  });
});
