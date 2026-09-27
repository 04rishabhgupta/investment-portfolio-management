'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, HelpCircle, FileText, ChevronRight } from 'lucide-react';

export default function SectorIntelPage() {
  const briefs = useAppStore(state => state.briefs) || [];
  const startups = useAppStore(state => state.startups);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#101C33]">Sector Intelligence</h1>
        <p className="text-slate-500 mt-2">Deep dive analysis and verification for specialized startups</p>
      </div>

      {briefs.length === 0 && (
        <div className="text-center p-12 text-slate-500 bg-white rounded-lg border border-dashed">
          No active sector briefs found.
        </div>
      )}

      <div className="space-y-8">
        {briefs.map(brief => {
          const startup = startups.find(s => s.id === brief.startupId);
          if (!startup) return null;

          return (
            <Card key={brief.id} className="shadow-sm border-[#14306B]/20">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-[#14306B]">{startup.name} Brief</CardTitle>
                    <CardDescription className="mt-1 font-medium text-slate-600">
                      Sector: <span className="uppercase text-xs tracking-wider bg-slate-200 px-2 py-1 rounded ml-1">{brief.sector.replace(/_/g, ' ')}</span>
                    </CardDescription>
                  </div>
                  {brief.recommendation && (
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">PM Recommendation</div>
                      <Badge className={
                        brief.recommendation === 'INVEST' ? 'bg-emerald-100 text-emerald-800' :
                        brief.recommendation === 'SUPPORT' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-800'
                      }>
                        {brief.recommendation}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brief.steps.map(step => (
                    <div key={step.stepNo} className={`p-4 rounded-lg border ${step.status === 'VERIFIED' ? 'bg-emerald-50/30 border-emerald-100' : step.status === 'DRAFT' ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-sm text-slate-800 flex items-center">
                          <span className="w-5 h-5 rounded-full bg-[#14306B] text-white text-[10px] flex items-center justify-center mr-2">{step.stepNo}</span>
                          {step.title}
                        </h3>
                        {step.status === 'VERIFIED' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {step.status === 'DRAFT' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      </div>

                      {step.sections.length > 0 ? (
                        <div className="space-y-4">
                          {step.sections.map((sec, idx) => (
                            <div key={idx}>
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{sec.heading}</h4>
                              <p className="text-sm text-slate-700 mb-2 leading-relaxed">{sec.body}</p>
                              <ul className="space-y-1.5">
                                {sec.claims.map((claim, cIdx) => (
                                  <li key={cIdx} className="text-xs flex items-start bg-white p-2 rounded border border-slate-100 shadow-sm">
                                    {claim.tag === 'FACT' ? <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1.5 mt-0.5 shrink-0" /> :
                                     claim.tag === 'ESTIMATE' ? <ChevronRight className="w-3 h-3 text-indigo-500 mr-1.5 mt-0.5 shrink-0" /> :
                                     <HelpCircle className="w-3 h-3 text-amber-500 mr-1.5 mt-0.5 shrink-0" />}
                                    <span className="text-slate-600">
                                      {claim.text} 
                                      <Badge variant="outline" className="ml-2 text-[8px] px-1 py-0 h-4">{claim.tag}</Badge>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 mt-4 text-center">Section pending exploration.</div>
                      )}

                      {step.redFlags.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200/50">
                          <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Identified Risks</h4>
                          {step.redFlags.map((flag, idx) => flag.present && (
                            <div key={idx} className="text-xs flex items-start text-red-700 bg-red-50 p-2 rounded">
                              <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 shrink-0" /> {flag.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
