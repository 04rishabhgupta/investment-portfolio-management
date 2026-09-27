import { Intervention } from '@/types';
import { playbooks } from '@/data/playbooks';

export function createInterventionPlan(startupId: string, flagId: string, playbookId: string, rootCause: string): Intervention {
  if (!rootCause) {
    throw new Error('Diagnose before you prescribe: A root cause is required to generate a plan.');
  }

  const pb = playbooks.find(p => p.id === playbookId);
  if (!pb) {
    throw new Error(`Playbook ${playbookId} not found`);
  }

  const tasks = pb.generateTasks(rootCause, startupId);

  return {
    id: `inv_${startupId}_${Date.now()}`,
    startupId,
    flagId,
    playbook: playbookId,
    rootCause,
    tasks
  };
}
