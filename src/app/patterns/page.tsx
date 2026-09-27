'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, GitMerge, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCopilot } from '@/lib/copilot/CopilotProvider';

export default function PatternsPage() {
  const startups = useAppStore(state => state.startups);
  const patterns = useAppStore(state => state.patterns) || [];
  const flags = useAppStore(state => state.flags);
  const copilot = useCopilot();

  const [insights, setInsights] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function analyze() {
      setAnalyzing(true);
      // Simulate Copilot generating macro insights based on portfolio data
      setTimeout(() => {
        setInsights([
          '3 startups in MedTech/Biotech are currently facing significant cash runway risks due to delayed grant disbursements (DST/BIRAC).',
          'Sector trend: AI/ML startups in the early incubation stage are burning 40% faster than historical averages, primarily driven by compute costs.',
          'Founding teams with a "Scientist" archetype are 2x more likely to miss commercialization milestones in the acceleration phase.'
        ]);
        setAnalyzing(false);
      }, 2000);
    }
    analyze();
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#101C33]">Cross-Portfolio Trends</h1>
        <p className="text-slate-500 mt-2">Macro-level intelligence and historical intervention patterns</p>
      </div>

      <Card className="shadow-sm border-[#14306B]/20 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-[#14306B]">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> Copilot Portfolio Insights
          </CardTitle>
          <CardDescription>Real-time synthesis of risk flags, monthly snapshots, and sector dynamics.</CardDescription>
        </CardHeader>
        <CardContent>
          {analyzing ? (
            <div className="flex items-center space-x-3 text-slate-500 animate-pulse py-4">
              <Search className="w-5 h-5" />
              <span>Scanning 452 recent data points across the portfolio...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.map((insight, i) => (
                <div key={i} className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#14306B] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {i + 1}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500">Auto-generated</Badge>
                    {i === 0 && <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700">Action Required</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold font-heading text-[#101C33] mb-4 flex items-center">
          <GitMerge className="w-5 h-5 mr-2 text-slate-500" /> Historical Intervention Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patterns.map(pattern => (
            <Card key={pattern.id} className="shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 mb-2">
                    {pattern.sector.replace('_', ' ')} • {pattern.stage.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-md flex items-start text-slate-800">
                  <AlertTriangle className="w-4 h-4 mr-2 text-amber-500 mt-1 shrink-0" /> 
                  <span className="leading-snug">{pattern.signal}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosed Root Cause</h4>
                  <p className="text-sm text-slate-700">{pattern.rootCause}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Lightbulb className="w-3 h-3 mr-1" /> Successful Intervention
                  </h4>
                  <p className="text-sm font-medium text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100">
                    {pattern.intervention}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> Historical Outcome
                  </h4>
                  <p className="text-sm text-emerald-700">{pattern.outcome}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
