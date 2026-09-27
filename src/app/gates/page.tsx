'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, FileText, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { evaluateAutoTicks } from '@/lib/engines/gates';

export default function GatesPage() {
  const gateRequests = useAppStore(state => state.gateRequests) || [];
  const startups = useAppStore(state => state.startups);
  const snapshots = useAppStore(state => state.snapshots);

  const [approving, setApproving] = useState<string | null>(null);
  
  const handleApprove = (id: string) => {
    setApproving(id);
    setTimeout(() => {
      setApproving(null);
      // In a real app we'd mutate state here. 
      // For demo, we just simulate the UI flow.
      alert('Gate Request Approved! Startup stage has been updated.');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#101C33]">Stage Gates</h1>
        <p className="text-slate-500 mt-2">Manage evidence-based stage transitions</p>
      </div>

      {gateRequests.length === 0 && (
        <div className="text-center p-12 text-slate-500 bg-white rounded-lg border border-dashed">
          No pending stage gate requests.
        </div>
      )}

      <div className="space-y-6">
        {gateRequests.map(request => {
          const startup = startups.find(s => s.id === request.startupId);
          if (!startup) return null;
          
          const latestSnapshot = snapshots
            .filter(s => s.startupId === startup.id)
            .sort((a, b) => b.month.localeCompare(a.month))[0];

          return (
            <Card key={request.id} className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center text-[#14306B]">
                      {startup.name} 
                      <Badge variant="outline" className="ml-3 bg-amber-50 text-amber-700 border-amber-200">
                        {request.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center text-sm font-medium text-slate-600">
                      <span className="bg-slate-200 px-2 py-1 rounded text-xs">{request.from.replace('_', ' ')}</span>
                      <ArrowRight className="w-4 h-4 mx-2 text-slate-400" />
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">{request.to.replace('_', ' ')}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Required Approver</div>
                    <Badge>{request.approverRole.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" /> Evidence Checklist
                </h3>
                
                <div className="space-y-3">
                  {request.evidence.map((ev, i) => (
                    <div key={i} className={`flex items-start justify-between p-3 rounded-md border ${ev.met ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-start space-x-3">
                        {ev.met ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className={`text-sm ${ev.met ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{ev.item}</p>
                          {ev.attachment && (
                            <div className="flex items-center mt-2 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium">
                              <FileText className="w-3 h-3 mr-1" /> {ev.attachment}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!ev.met && (
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          Request Evidence
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t justify-end space-x-3">
                <Button variant="ghost" className="text-slate-600">Return to Founder</Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                  disabled={approving === request.id}
                  onClick={() => handleApprove(request.id)}
                >
                  {approving === request.id ? 'Processing...' : 'Approve Transition'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
