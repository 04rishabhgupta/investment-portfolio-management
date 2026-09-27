import { describe, it, expect } from 'vitest';
import { calculateTotalScore, getBand, calculateRank } from './health';

describe('Health Engine', () => {
  it('should sum weights to exactly 1 (100%)', () => {
    // This is tested implicitly by checking max scores
    const perfectScores = {
      TECH: 100, TEAM: 100, DISCOVERY: 100, CASH: 100, 
      EXECUTION: 100, IP: 100, ENGAGEMENT: 100, REVENUE: 100
    };
    expect(calculateTotalScore(perfectScores, 'PRE_REVENUE')).toBe(100);
    expect(calculateTotalScore(perfectScores, 'ACCELERATION')).toBe(100);
  });

  it('should classify bands correctly at boundaries', () => {
    expect(getBand(75)).toBe('HEALTHY');
    expect(getBand(74)).toBe('WATCH');
    expect(getBand(55)).toBe('WATCH');
    expect(getBand(54)).toBe('AT_RISK');
    expect(getBand(35)).toBe('AT_RISK');
    expect(getBand(34)).toBe('CRITICAL');
  });

  it('should rank correctly (62 falling from 75 outranks 55 rising from 40)', () => {
    // Rank formula: (100 - total) + 1.5 * max(0, -delta) + 20 * redFlags + 8 * amberFlags
    // delta3m = total(month) - total(month-3)
    
    // 62 falling from 75 -> delta3m = 62 - 75 = -13
    const rankA = calculateRank(62, -13, 0, 0); 
    // 55 rising from 40 -> delta3m = 55 - 40 = 15
    const rankB = calculateRank(55, 15, 0, 0);

    expect(rankA).toBeGreaterThan(rankB);
  });
});
