'use client';

import { useVisibleStartups } from '@/lib/store/selectors';
import { useAppStore } from '@/lib/store/useAppStore';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Calendar, Upload, CheckCircle } from 'lucide-react';
import { getDemoDate } from '@/lib/clock';

export default function FounderPage() {
  const visibleStartups = useVisibleStartups();
  const activeUser = useAppStore(state => state.users.find(u => u.id === state.activeUserId));
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (activeUser?.role !== 'FOUNDER') {
    return <div className="p-8 text-center text-red-500">Access Denied: This portal is for Founders only.</div>;
  }

  const startup = visibleStartups[0];
  if (!startup) {
    return <div className="p-8 text-center">No startup linked to your account.</div>;
  }

  const handleSnapshotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[#101C33]">Founder Portal</h1>
          <p className="text-slate-500 mt-2">Welcome back, {activeUser.name}</p>
        </div>
        <Button className="bg-[#14306B] hover:bg-[#14306B]/90">
          <Calendar className="w-4 h-4 mr-2" /> Request Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-t-4 border-t-[#14306B] shadow-sm">
          <CardHeader>
            <CardTitle>{startup.name}</CardTitle>
            <CardDescription>{startup.stage.replace('_', ' ')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">TRL</div>
              <div className="font-medium">{startup.trl}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Sector</div>
              <div className="font-medium">{startup.sector.replace('_', ' ')}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-[#14306B]" /> Monthly Snapshot Submission
            </CardTitle>
            <CardDescription>
              Submit your metrics for {getDemoDate().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-lg flex flex-col items-center justify-center space-y-2 border border-emerald-100">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <p className="font-semibold">Snapshot Submitted Successfully!</p>
                <p className="text-sm">Your PM has been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleSnapshotSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="burn">Monthly Burn (₹ Lakhs)</Label>
                    <Input id="burn" type="number" step="0.1" required placeholder="e.g. 5.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="runway">Runway Remaining (Months)</Label>
                    <Input id="runway" type="number" step="0.1" required placeholder="e.g. 12" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conversations">User Conversations this month</Label>
                    <Input id="conversations" type="number" required placeholder="e.g. 15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestones">Milestones Delivered (vs Planned)</Label>
                    <Input id="milestones" type="text" required placeholder="e.g. 2/3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Key Updates & Blockers</Label>
                  <Textarea id="notes" required placeholder="What went well? Where are you stuck?" className="h-24" />
                </div>

                <Button type="submit" className="w-full bg-[#14306B] hover:bg-[#14306B]/90">
                  <Upload className="w-4 h-4 mr-2" /> Submit Snapshot
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
