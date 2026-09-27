import { describe, it, expect } from 'vitest';
import { canSubmitGateRequest, evaluateAutoTicks } from './gates';
import { GateRequest, Startup, MonthlySnapshot } from '@/types';

describe('Gates Engine', () => {
  it('should auto-tick rules correctly', () => {
    const startup = { trl: 7, commercialSignal: 'PAYING' } as Startup;
    const snapshot = { runwayMonths: 10 } as MonthlySnapshot;
    
    const checklist = [
      'At least one paying customer or signed pilot LoI',
      'TRL >= 6',
      '6+ months runway',
      'Commercial co-founder identified'
    ];

    const evalResult = evaluateAutoTicks(startup, snapshot, checklist);
    
    expect(evalResult.find(r => r.item === 'TRL >= 6')?.met).toBe(true);
    expect(evalResult.find(r => r.item === 'At least one paying customer or signed pilot LoI')?.met).toBe(true);
    expect(evalResult.find(r => r.item === '6+ months runway')?.met).toBe(true);
    expect(evalResult.find(r => r.item === 'Commercial co-founder identified')?.met).toBe(false); // Can't be auto-ticked
  });

  it('should block submission if any item is unmet', () => {
    const request: GateRequest = {
      evidence: [
        { item: 'A', met: true },
        { item: 'B', met: false }
      ]
    } as GateRequest;
    
    expect(canSubmitGateRequest(request)).toBe(false);
  });
});
