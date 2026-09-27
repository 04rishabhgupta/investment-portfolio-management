import { RiskFlag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { indicators } from '@/data/indicators';

export function FlagInbox({ flags }: { flags: RiskFlag[] }) {
  const startups = useAppStore(state => state.startups);
  
  if (flags.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed border-2">
        <CardContent className="p-6 text-center text-slate-500">
          No open flags requiring attention.
        </CardContent>
      </Card>
    );
  }

  // Sort: Level 2 first, then Level 1, then RED, then AMBER, then date
  const sortedFlags = [...flags].sort((a, b) => {
    if (a.escalationLevel !== b.escalationLevel) return b.escalationLevel - a.escalationLevel;
    if (a.severity !== b.severity) return a.severity === 'RED' ? -1 : 1;
    return new Date(a.raisedOn).getTime() - new Date(b.raisedOn).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedFlags.map(flag => {
        const startup = startups.find(s => s.id === flag.startupId);
        const ind = indicators.find(i => i.id === flag.indicatorId);
        if (!startup || !ind) return null;

        const isOverdue = flag.escalationLevel > 0;

        return (
          <Card key={flag.id} className={`border-l-4 ${flag.severity === 'RED' ? 'border-l-red-500 bg-red-50/30' : 'border-l-amber-500 bg-amber-50/30'}`}>
            <CardContent className="p-4 flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${flag.severity === 'RED' ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-slate-800">{startup.name}</span>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{ind.category}</Badge>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-[10px]">
                        <Clock className="w-3 h-3 mr-1" /> Overdue L{flag.escalationLevel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{ind.label}</p>
                  <p className="text-xs text-slate-500 mt-1">Recommended Action: {ind.action}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
