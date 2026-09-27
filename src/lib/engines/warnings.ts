import { Startup, MonthlySnapshot, RiskFlag } from '@/types';
import { indicators, Indicator, EvaluationContext } from '@/data/indicators';
import { addHours, isAfter } from 'date-fns';
import { getDemoDate } from '../clock';

export function evaluateNightlyFlags(
  startups: Startup[], 
  snapshots: MonthlySnapshot[],
  currentFlags: RiskFlag[]
): RiskFlag[] {
  const newFlags: RiskFlag[] = [];
  const demoToday = getDemoDate();

  for (const startup of startups) {
    // Get latest snapshot for this startup
    const startupSnapshots = snapshots.filter(s => s.startupId === startup.id).sort((a, b) => b.month.localeCompare(a.month));
    if (startupSnapshots.length === 0) continue;
    
    const snapshot = startupSnapshots[0];
    const prevSnapshot = startupSnapshots.length > 1 ? startupSnapshots[1] : undefined;
    const ctx: EvaluationContext = { startup, snapshot, prevSnapshot };

    // Find all auto-indicators that evaluate to true
    const triggered = indicators.filter(ind => !ind.pmOnly && ind.check && ind.check(ctx));

    for (const ind of triggered) {
      // Check if a flag for this indicator already exists and is not resolved/dismissed
      const existing = currentFlags.find(f => f.startupId === startup.id && f.indicatorId === ind.id && !['RESOLVED', 'DISMISSED'].includes(f.status));
      
      if (!existing) {
        newFlags.push({
          id: `flag_${startup.id}_${ind.id}_${Date.now()}`,
          startupId: startup.id,
          indicatorId: ind.id,
          severity: ind.severity,
          raisedOn: demoToday.toISOString(),
          slaDue: addHours(demoToday, ind.slaHours).toISOString(),
          escalationLevel: 0,
          status: 'OPEN',
          source: 'RULE',
          evidence: `Rule triggered by nightly evaluation on ${demoToday.toISOString().split('T')[0]}`
        });
      }
    }
  }

  return newFlags;
}

export function updateEscalations(flags: RiskFlag[]): RiskFlag[] {
  const demoToday = getDemoDate();
  
  return flags.map(flag => {
    if (['RESOLVED', 'DISMISSED'].includes(flag.status)) return flag;

    const ind = indicators.find(i => i.id === flag.indicatorId);
    if (!ind) return flag;

    const due = new Date(flag.slaDue);
    
    // Level 1: Overdue
    // Level 2: Overdue by further SLA period
    const overdueHours = (demoToday.getTime() - due.getTime()) / (1000 * 60 * 60);

    let newLevel: 0 | 1 | 2 = flag.escalationLevel;

    if (overdueHours > ind.slaHours) {
      newLevel = 2;
    } else if (overdueHours > 0) {
      newLevel = 1;
    }

    if (newLevel !== flag.escalationLevel) {
      return { ...flag, escalationLevel: newLevel };
    }
    return flag;
  });
}
