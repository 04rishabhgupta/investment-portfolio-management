'use client';

import { useVisibleStartups } from '@/lib/store/selectors';
import { useAppStore } from '@/lib/store/useAppStore';
import { rankMentors } from '@/lib/engines/mentorRanking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Mentor } from '@/types';

export default function MentorsPage() {
  const visibleStartups = useVisibleStartups();
  const mentors = useAppStore(state => state.mentors);
  const [selectedStartupId, setSelectedStartupId] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (visibleStartups.length > 0 && !selectedStartupId) {
      setSelectedStartupId(visibleStartups[0].id);
    }
  }, [visibleStartups, selectedStartupId]);

  if (!mounted) return null;

  const startup = visibleStartups.find(s => s.id === selectedStartupId);
  
  let rankedMentors: { mentor: Mentor; score: number; explanation: string[] }[] = [];
  if (startup && mentors) {
    const dummyRequest = { id: 'r1', startupId: startup.id, expertiseNeeded: ['GTM Strategy', 'Clinical Trials'] } as any;
    const rawRanks = rankMentors(mentors, startup, dummyRequest);
    rankedMentors = rawRanks.map(r => ({
      mentor: mentors.find(m => m.id === r.mentorId)!,
      score: r.score,
      explanation: [r.reasoning]
    })).filter(r => r.mentor);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#101C33]">Mentor Connect</h1>
          <p className="text-slate-500 mt-2">Algorithmic Mentor Matching</p>
        </div>
        
        <div className="flex items-center space-x-3 w-72">
          <span className="text-sm font-medium text-slate-500">Startup Context:</span>
          <Select value={selectedStartupId} onValueChange={setSelectedStartupId}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select startup" />
            </SelectTrigger>
            <SelectContent>
              {visibleStartups.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!startup ? (
        <div className="text-center p-12 text-slate-500 bg-white rounded-lg border border-dashed">
          Select a startup to see mentor matches.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedMentors.map(({ mentor, score, explanation }, idx) => (
            <Card key={mentor.id} className={`shadow-sm flex flex-col ${idx === 0 ? 'border-[#14306B] border-2 shadow-md relative' : ''}`}>
              {idx === 0 && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-[#14306B] text-white text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-sm">
                  <Star className="w-3 h-3 mr-1 fill-white" /> Top Match
                </div>
              )}
              
              <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase mt-1 tracking-wider text-indigo-600">
                    {mentor.sectors.join(' • ').replace(/_/g, ' ')}
                  </CardDescription>
                </div>
                <div className={`text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center border-4 ${
                  score >= 80 ? 'border-green-200 text-green-700 bg-green-50' : 
                  score >= 60 ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-500 bg-slate-50'
                }`}>
                  {score}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-2">Why they match:</div>
                  <ul className="space-y-1 mb-4">
                    {explanation.map((reason, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start">
                        <ArrowRight className="w-3 h-3 mr-1.5 mt-0.5 text-slate-400 shrink-0" /> 
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-2 flex-wrap mb-4">
                    {mentor.expertise.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Capacity: <span className="font-semibold text-slate-700">{mentor.maxActiveMatches} Active</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <MessageCircle className="w-4 h-4 mr-1.5" /> Request Intro
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
