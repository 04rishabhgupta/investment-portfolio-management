'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Video, Sparkles, CheckSquare, PlusCircle } from 'lucide-react';
import { useCopilot } from '@/lib/copilot/CopilotProvider';

export default function MeetingsPage() {
  const copilot = useCopilot();
  const [transcript, setTranscript] = useState(`[PM] So how is the clinical trial planning going for Sanjeevani?
[Founder] It's been tough. Cash runway is getting tight since the grant disbursement is delayed. We did get the hospital job offer for the pilot though.
[PM] That's great news about the pilot. 
[Founder] Yes, we completed 6 conversations this month with the hospital staff. But honestly, I'm feeling a bit of personal motivation / burnout risk with all these delays.
[PM] I understand. I'll check regulatory fast-track options by next week, let's say Oct 7th. You should follow up with the granting agency by the 10th.`);

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const summary = await copilot.draftMeetingNote(transcript);
      setResult(summary);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[#101C33]">Meeting Hub</h1>
        <p className="text-slate-500 mt-2">AI-Assisted Check-ins & Action Extraction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <Card className="shadow-sm flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center text-[#14306B]">
              <Video className="w-5 h-5 mr-2" /> Meeting Transcript
            </CardTitle>
            <CardDescription>Paste meeting notes or rough transcript here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea 
              className="flex-1 resize-none bg-slate-50 font-mono text-sm leading-relaxed" 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste meeting transcript here..."
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-[#14306B] hover:bg-[#14306B]/90" 
              onClick={handleProcess}
              disabled={processing || !transcript.trim()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {processing ? 'Processing AI Magic...' : 'Extract Notes & Actions'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm h-[600px] overflow-y-auto">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-slate-800 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-emerald-600" /> Auto-Generated Summary
            </CardTitle>
            <CardDescription>Review and approve AI-extracted structured data.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!result && !processing && (
              <div className="text-center text-slate-400 mt-20">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Run extraction to see AI summary here</p>
              </div>
            )}
            
            {processing && (
              <div className="text-center text-indigo-500 mt-20 animate-pulse">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <p>Analyzing conversation context...</p>
              </div>
            )}
            
            {result && !processing && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wins</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.wins.map((w: string, i: number) => <li key={i} className="text-sm text-slate-700">{w}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Challenges</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.challenges.map((c: string, i: number) => <li key={i} className="text-sm text-red-600">{c}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data Update</h4>
                  <div className="bg-slate-50 p-3 rounded-md border text-sm font-mono text-slate-700">
                    {result.dataUpdate}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Commitments (Tasks)</h4>
                  <div className="space-y-2">
                    {result.commitments.map((c: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Badge variant={c.owner === 'PM' ? 'default' : 'secondary'} className="w-16 justify-center">
                            {c.owner}
                          </Badge>
                          <span className="text-sm font-medium">{c.text}</span>
                        </div>
                        <div className="text-xs text-slate-400">{c.due}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.suggestedSoftFlags.length > 0 && (
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">AI Suggested Risk Flags</h4>
                    <div className="flex gap-2">
                      {result.suggestedSoftFlags.map((f: string) => (
                        <Badge key={f} variant="outline" className="bg-white border-amber-300 text-amber-700 cursor-pointer hover:bg-amber-100">
                          <PlusCircle className="w-3 h-3 mr-1" /> Add Flag {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Approve & Save Meeting Note
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
