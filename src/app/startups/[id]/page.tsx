'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { calculateSuggestedScores, calculateTotalScore, getBand } from '@/lib/engines/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, Activity, ShieldAlert, FileText, CheckCircle } from 'lucide-react';
import { useCopilot } from '@/lib/copilot/CopilotProvider';
import { format } from 'date-fns';

export default function StartupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const startups = useAppStore(state => state.startups);
  const snapshots = useAppStore(state => state.snapshots);
  const flags = useAppStore(state => state.flags);
  const [mounted, setMounted] = useState(false);
  
  const copilot = useCopilot();
  const [drafting, setDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const startup = startups.find(s => s.id === id);
  if (!startup) {
    return <div className="p-8">Startup not found</div>;
  }

  const startupSnapshots = snapshots.filter(s => s.startupId === startup.id).sort((a, b) => b.month.localeCompare(a.month));
  const startupFlags = flags.filter(f => f.startupId === startup.id && f.status === 'OPEN');
  
  const currentSnapshot = startupSnapshots[0] || { month: '', runwayMonths: 12, userConversations: 0 };
  const profile = ['ACCELERATION', 'GRADUATION', 'INVESTMENT_PORTFOLIO'].includes(startup.stage) ? 'ACCELERATION' : 'PRE_REVENUE';
  const scores = calculateSuggestedScores(startup, currentSnapshot, startupFlags);
  const totalScore = calculateTotalScore(scores, profile);
  const band = getBand(totalScore);

  let bandColor = 'bg-health-healthy text-white';
  if (band === 'WATCH') bandColor = 'bg-health-watch text-white';
  if (band === 'AT_RISK') bandColor = 'bg-health-atrisk text-white';
  if (band === 'CRITICAL') bandColor = 'bg-health-critical text-white';

  const handleDraftSectorBrief = async () => {
    setDrafting(true);
    try {
      const result = await copilot.draftSectorBriefStep(1, { startup, snapshot: currentSnapshot });
      setDraftResult(result);
    } finally {
      setDrafting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold font-heading text-[#101C33]">{startup.name}</h1>
          <div className="flex space-x-3 mt-3 items-center">
            <Badge variant="outline" className="border-slate-300 text-slate-600">{startup.sector.replace('_', ' ')}</Badge>
            <Badge variant="outline" className="border-slate-300 text-slate-600">{startup.stage.replace('_', ' ')}</Badge>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${bandColor}`}>
              {band.replace('_', ' ')}
            </div>
          </div>
          <p className="text-slate-500 mt-4 max-w-2xl">{startup.description}</p>
        </div>
        
        <div className="flex flex-col items-end space-y-4">
          <Button 
            onClick={handleDraftSectorBrief} 
            disabled={drafting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
          >
            <Sparkles className="w-4 h-4 mr-2" /> 
            {drafting ? 'Drafting...' : 'Draft Sector Brief (AI)'}
          </Button>
          
          <div className="grid grid-cols-2 gap-4 text-right">
             <div>
               <div className="text-xs text-slate-400 font-semibold uppercase">TRL</div>
               <div className="text-2xl font-bold text-slate-700">{startup.trl}</div>
             </div>
             <div>
               <div className="text-xs text-slate-400 font-semibold uppercase">Runway</div>
               <div className="text-2xl font-bold text-slate-700">{currentSnapshot.runwayMonths} <span className="text-sm font-normal text-slate-500">mo</span></div>
             </div>
          </div>
        </div>
      </div>

      {draftResult && (
        <Card className="bg-indigo-50 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> Sector Brief Draft (Step 1)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-indigo-800 space-y-2 whitespace-pre-line">
            {JSON.stringify(draftResult, null, 2)}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <FileText className="w-5 h-5 mr-2 text-slate-500" /> Snapshot Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {startupSnapshots.length === 0 ? (
                <div className="text-slate-500 text-sm">No snapshots available.</div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {startupSnapshots.map(snap => (
                    <div key={snap.month} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-[#14306B] text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-800">{format(new Date(snap.month + '-01'), 'MMMM yyyy')}</h4>
                          <span className="text-xs font-medium text-slate-500">{snap.runwayMonths}mo runway</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{snap.notes}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-[10px]">Burn: ${snap.monthlyBurn}</Badge>
                          <Badge variant="secondary" className="text-[10px]">Users: {snap.userConversations}</Badge>
                          <Badge variant="secondary" className="text-[10px]">Mentors: {snap.mentorSessionsLast90d}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="border-red-100 bg-white">
            <CardHeader className="bg-red-50/50 rounded-t-xl border-b border-red-100 pb-4">
              <CardTitle className="flex items-center text-red-700 text-base">
                <ShieldAlert className="w-5 h-5 mr-2 text-red-500" /> Active Risk Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {startupFlags.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 text-center">No active flags.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {startupFlags.map(flag => (
                    <div key={flag.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className={flag.severity === 'RED' ? 'text-red-600 border-red-200' : 'text-amber-600 border-amber-200'}>
                          {flag.severity}
                        </Badge>
                        {flag.escalationLevel > 0 && <span className="text-xs text-red-500 font-bold">L{flag.escalationLevel}</span>}
                      </div>
                      <p className="text-sm font-medium text-slate-800 mt-2">{flag.indicatorId} - {flag.evidence || 'Rule triggered'}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700 text-base">
                <Activity className="w-5 h-5 mr-2 text-slate-400" /> Founders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startup.founders.map(f => (
                  <div key={f.name} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{f.name}</div>
                      <div className="text-xs text-slate-500 flex space-x-2 mt-0.5">
                        <span>{f.isTechnical ? 'Technical' : 'Business'}</span>
                        <span>•</span>
                        <span>{f.fullTime ? 'Full-time' : 'Part-time'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
