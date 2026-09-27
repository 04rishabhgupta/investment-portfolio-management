import { describe, it, expect } from 'vitest';
import { createInterventionPlan } from './interventions';

describe('Interventions Engine', () => {
  it('should throw if no root cause is provided', () => {
    expect(() => createInterventionPlan('s1', 'f1', 'PB_CASH', ''))
      .toThrowError('Diagnose before you prescribe: A root cause is required to generate a plan.');
  });

  it('should generate a plan with tasks', () => {
    const plan = createInterventionPlan('s1', 'f1', 'PB_CASH', 'Grant approved but not disbursed');
    expect(plan.tasks.length).toBe(4);
    expect(plan.tasks[2].action).toContain('Escalate to granting agency');
    expect(plan.tasks[2].owner).toBe('PROGRAM_HEAD');
  });
});
