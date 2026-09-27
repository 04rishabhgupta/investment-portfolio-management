'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { useVisibleStartups } from '@/lib/store/selectors';
import { calculateSuggestedScores, calculateTotalScore, calculateRank, getBand } from '@/lib/engines/health';
import { StartupCard } from '@/components/dashboard/StartupCard';
import { FlagInbox } from '@/components/dashboard/FlagInbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInMonths } from 'date-fns';
import { getDemoDate } from '@/lib/clock';
import { useEffect, useState } from 'react';

export default function CommandCenterPage() {
  const visibleStartups = useVisibleStartups();
  const flags = useAppStore(state => state.flags);
  const snapshots = useAppStore(state => state.snapshots);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate enhanced data for each startup
  const startupData = visibleStartups.map(startup => {
    const startupFlags = flags.filter(f => f.startupId === startup.id && f.status === 'OPEN');
    const startupSnapshots = snapshots.filter(s => s.startupId === startup.id).sort((a, b) => b.month.localeCompare(a.month));
    
    const currentSnapshot = startupSnapshots[0] || { month: '', runwayMonths: 12, userConversations: 0 } as any; // dummy fallback
    const scores = calculateSuggestedScores(startup, currentSnapshot, startupFlags);
    
    // For demo: assume ACCELERATION for stage ACCELERATION/GRADUATION/INVESTMENT, else PRE_REVENUE
    const profile = ['ACCELERATION', 'GRADUATION', 'INVESTMENT_PORTFOLIO'].includes(startup.stage) ? 'ACCELERATION' : 'PRE_REVENUE';
    const totalScore = calculateTotalScore(scores, profile);
    const band = getBand(totalScore);

    // Mock 3 month delta (ideally read from snapshot 3 months ago)
    let delta3m = 0;
    if (startupSnapshots.length > 3) {
       const oldScores = calculateSuggestedScores(startup, startupSnapshots[3], []);
       const oldTotal = calculateTotalScore(oldScores, profile);
       delta3m = totalScore - oldTotal;
    } else {
       // fallback mock delta
       delta3m = startup.name === 'SkyOps' ? 5 : (startup.name === 'NeuroFlow' ? -12 : 0);
    }

    const openRedFlags = startupFlags.filter(f => f.severity === 'RED').length;
    const openAmberFlags = startupFlags.filter(f => f.severity === 'AMBER').length;

    const rank = calculateRank(totalScore, delta3m, openRedFlags, openAmberFlags);

    return {
      startup,
      score: totalScore,
      band,
      rank,
      delta3m,
      openRedFlags,
      openAmberFlags,
      flags: startupFlags
    };
  });

  // Sort by rank descending
  startupData.sort((a, b) => b.rank - a.rank);

  // Extract relevant flags
  const allRelevantFlags = startupData.flatMap(d => d.flags);

  // Group by band
  const grouped = {
    CRITICAL: startupData.filter(d => d.band === 'CRITICAL'),
    AT_RISK: startupData.filter(d => d.band === 'AT_RISK'),
    WATCH: startupData.filter(d => d.band === 'WATCH'),
    HEALTHY: startupData.filter(d => d.band === 'HEALTHY'),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#101C33]">Command Center</h1>
          <p className="text-slate-500 mt-2">Portfolio Overview & Risk Management</p>
        </div>
        
        <div className="flex space-x-4">
          <Card className="w-32">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-slate-800">{visibleStartups.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold mt-1">Total</div>
            </CardContent>
          </Card>
          <Card className="w-32">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-health-critical">{grouped.CRITICAL.length + grouped.AT_RISK.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold mt-1">At Risk +</div>
            </CardContent>
          </Card>
          <Card className="w-32">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-500">{allRelevantFlags.length}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold mt-1">Open Flags</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {['CRITICAL', 'AT_RISK', 'WATCH', 'HEALTHY'].map((band) => {
             const bandGroup = grouped[band as keyof typeof grouped];
             if (bandGroup.length === 0) return null;
             
             let title = 'Healthy';
             let color = 'text-health-healthy';
             if (band === 'CRITICAL') { title = 'Critical Attention'; color = 'text-health-critical'; }
             if (band === 'AT_RISK') { title = 'At Risk'; color = 'text-health-atrisk'; }
             if (band === 'WATCH') { title = 'Watchlist'; color = 'text-health-watch'; }

             return (
               <div key={band}>
                 <h3 className={`text-lg font-bold mb-4 uppercase tracking-wider ${color}`}>
                   {title} ({bandGroup.length})
                 </h3>
                 <div className="space-y-3">
                   {bandGroup.map(d => (
                     <StartupCard 
                       key={d.startup.id} 
                       startup={d.startup} 
                       score={d.score} 
                       delta3m={d.delta3m} 
                       openRedFlags={d.openRedFlags} 
                       openAmberFlags={d.openAmberFlags} 
                     />
                   ))}
                 </div>
               </div>
             );
          })}

        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-slate-700">Flag Inbox</h3>
            <FlagInbox flags={allRelevantFlags} />
          </div>
        </div>
      </div>

    </div>
  );
}
