import { describe, it, expect } from 'vitest';
import { evaluateNightlyFlags, updateEscalations } from './warnings';
import { Startup, MonthlySnapshot, RiskFlag } from '@/types';
import { getDemoDate } from '../clock';
import { addHours, subHours } from 'date-fns';

describe('Warnings Engine', () => {
  it('should trigger F2 (Runway <3 months) correctly and not duplicate', () => {
    const startup: Startup = { id: 's1', stage: 'MID_INCUBATION', ip: { ownershipClear: true }, founders: [] } as unknown as Startup;
    const snapshot: MonthlySnapshot = { startupId: 's1', month: '2026-10', runwayMonths: 2.9, spendLines: [] } as unknown as MonthlySnapshot;

    // Run first time
    const newFlags = evaluateNightlyFlags([startup], [snapshot], []);
    expect(newFlags.find(f => f.indicatorId === 'F2')).toBeDefined();

    // Run second time with the flag already existing
    const newFlags2 = evaluateNightlyFlags([startup], [snapshot], newFlags);
    expect(newFlags2.find(f => f.indicatorId === 'F2')).toBeUndefined();
  });

  it('should escalate overdue flags', () => {
    const demoToday = getDemoDate();
    
    const flags: RiskFlag[] = [
      {
        id: 'f1',
        startupId: 's1',
        indicatorId: 'F2', // sla is 24h
        severity: 'RED',
        raisedOn: subHours(demoToday, 30).toISOString(),
        slaDue: subHours(demoToday, 6).toISOString(), // 6 hours overdue
        escalationLevel: 0,
        status: 'OPEN',
        source: 'RULE',
        evidence: ''
      },
      {
        id: 'f2',
        startupId: 's1',
        indicatorId: 'F2', // sla is 24h
        severity: 'RED',
        raisedOn: subHours(demoToday, 60).toISOString(),
        slaDue: subHours(demoToday, 36).toISOString(), // 36 hours overdue (> 24h sla)
        escalationLevel: 1,
        status: 'OPEN',
        source: 'RULE',
        evidence: ''
      }
    ];

    const updated = updateEscalations(flags);
    expect(updated[0].escalationLevel).toBe(1); // 6 hours overdue -> level 1
    expect(updated[1].escalationLevel).toBe(2); // 36 hours overdue -> level 2
  });
});
