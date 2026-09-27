import { Startup } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateRank, getBand } from '@/lib/engines/health';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import Link from 'next/link';

interface StartupCardProps {
  startup: Startup;
  score: number;
  delta3m: number;
  openRedFlags: number;
  openAmberFlags: number;
}

export function StartupCard({ startup, score, delta3m, openRedFlags, openAmberFlags }: StartupCardProps) {
  const band = getBand(score);
  const rank = calculateRank(score, delta3m, openRedFlags, openAmberFlags);

  let bandColor = 'bg-health-healthy text-white';
  if (band === 'WATCH') bandColor = 'bg-health-watch text-white';
  if (band === 'AT_RISK') bandColor = 'bg-health-atrisk text-white';
  if (band === 'CRITICAL') bandColor = 'bg-health-critical text-white';

  return (
    <Link href={`/startups/${startup.id}`}>
      <Card className="mb-4 hover:border-[#14306B] border-2 border-transparent transition-colors cursor-pointer bg-white">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="font-bold text-lg text-slate-800">{startup.name}</div>
            <Badge variant="outline" className="text-xs text-slate-500 border-slate-300">
              {startup.stage.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-center space-x-8 w-2/3 justify-end">
            <div className="flex space-x-2">
              {openRedFlags > 0 && <Badge className="bg-red-500">{openRedFlags} Red</Badge>}
              {openAmberFlags > 0 && <Badge className="bg-amber-500">{openAmberFlags} Amber</Badge>}
            </div>

            <div className="flex flex-col items-end w-24">
              <div className="text-xs text-slate-400">Score</div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-xl text-slate-700">{score}</span>
                {delta3m > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : delta3m < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            <div className="w-24 flex justify-end">
               <div className={`px-3 py-1 rounded-full text-xs font-semibold ${bandColor}`}>
                 {band.replace('_', ' ')}
               </div>
            </div>
            
            <div className="w-16 flex flex-col items-end">
              <div className="text-xs text-slate-400">Rank</div>
              <div className="font-mono text-sm text-slate-600">{rank.toFixed(1)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

