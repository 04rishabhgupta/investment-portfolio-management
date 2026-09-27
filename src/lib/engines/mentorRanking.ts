import { Mentor, Startup, MatchRequest } from '@/types';
import { sectorMapping, stageMapping } from '@/data/mentorTaxonomy';

export function rankMentors(mentors: Mentor[], startup: Startup, request: MatchRequest): { mentorId: string; score: number; reasoning: string }[] {
  const mappedSectors = sectorMapping[startup.sector] || [];
  const mappedStages = stageMapping[startup.stage] || [];

  const ranked = mentors.map(mentor => {
    let score = 0;

    // Sector match: 35
    let sectorScore = 0;
    if (mentor.sectors.some(s => mappedSectors.includes(s))) {
      sectorScore = 35;
    } else if (mentor.sectors.includes('Other') || mentor.sectors.includes('DeepTech')) {
      sectorScore = 15;
    }
    score += sectorScore;

    // Expertise match: 35 * (matched / requested)
    let expertiseScore = 0;
    if (request.expertiseNeeded.length > 0) {
      const matchedExpertise = request.expertiseNeeded.filter(e => mentor.expertise.includes(e));
      expertiseScore = Math.round(35 * (matchedExpertise.length / request.expertiseNeeded.length));
    }
    score += expertiseScore;

    // Stage fit: 15
    let stageScore = 0;
    if (mentor.stages.some(s => mappedStages.includes(s))) {
      stageScore = 15;
    }
    score += stageScore;

    // Capacity: 15 scaled by availability
    let capacityScore = 0;
    // Assuming activeMatches count would be passed in or looked up, for demo we mock it as < maxActiveMatches
    // Real implementation would look up current active matches. Here we'll just check max > 0
    if (mentor.maxActiveMatches > 0) { // simplified
      if (mentor.availability === 'HIGH') capacityScore = 15;
      else if (mentor.availability === 'MEDIUM') capacityScore = 10;
      else if (mentor.availability === 'LOW') capacityScore = 5;
    }
    score += capacityScore;

    // TRL bonus: 5
    if (mentor.trlBand && startup.trl >= mentor.trlBand[0] && startup.trl <= mentor.trlBand[1]) {
      score += 5;
    }

    score = Math.min(100, score);

    // Reasoning
    const reasoning = `Matched on ${sectorScore > 0 ? 'sector' : 'general expertise'} with ${expertiseScore > 0 ? 'relevant skills' : 'some skills'} for the challenge. Availability is ${mentor.availability}.`;

    return { mentorId: mentor.id, score, reasoning };
  });

  return ranked
    .filter(r => r.score > 0) // optionally filter out zero score
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
