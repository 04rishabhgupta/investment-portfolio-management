import { Startup, MonthlySnapshot, GateRequest, Stage } from '@/types';
import { gates } from '@/data/gates';

export function evaluateAutoTicks(startup: Startup, snapshot: MonthlySnapshot, checklist: string[]): { item: string, met: boolean }[] {
  return checklist.map(item => {
    let met = false;
    
    // Auto-evaluate based on data
    if (item === 'TRL >= 4' && startup.trl >= 4) met = true;
    if (item === 'TRL >= 6' && startup.trl >= 6) met = true;
    if (item === 'Full founding team full-time') {
      met = startup.founders.length > 0 && startup.founders.every(f => !f.active || f.fullTime);
    }
    if (item === 'At least one paying customer or signed pilot LoI') {
      met = ['PAYING', 'PILOT_LOI'].includes(startup.commercialSignal);
    }
    if (item === '6+ months runway') {
      met = snapshot.runwayMonths >= 6;
    }
    if (item === '50+ documented problem conversations') {
      met = snapshot.userConversations >= 50; // Note: simplified, should probably be cumulative
    }
    
    return { item, met };
  });
}

export function canSubmitGateRequest(request: GateRequest): boolean {
  return request.evidence.every(e => e.met);
}
