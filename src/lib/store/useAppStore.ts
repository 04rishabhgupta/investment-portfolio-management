import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as initialData from '@/data/seed';
import { User, Role, Startup, MonthlySnapshot, HealthScore, Meeting, RiskFlag, Mentor, MatchRequest, Match, SectorBrief, Pattern, GateRequest } from '@/types';

interface AppState {
  users: User[];
  startups: Startup[];
  snapshots: MonthlySnapshot[];
  scores: HealthScore[];
  meetings: Meeting[];
  flags: RiskFlag[];
  mentors: Mentor[];
  matchRequests: MatchRequest[];
  matches: Match[];
  briefs: SectorBrief[];
  patterns: Pattern[];
  gateRequests: GateRequest[];
  
  activeUserId: string;
  
  // Actions
  setActiveUserId: (id: string) => void;
  resetDemoData: () => void;
  
  // Add other mutations here later
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: initialData.seededUsers,
      startups: initialData.seededStartups,
      snapshots: initialData.seededSnapshots,
      scores: initialData.seededScores,
      meetings: initialData.seededMeetings,
      flags: initialData.seededFlags,
      mentors: initialData.seededMentors,
      matchRequests: initialData.seededMatchRequests,
      matches: initialData.seededMatches,
      briefs: initialData.seededBriefs,
      patterns: initialData.seededPatterns,
      gateRequests: initialData.seededGateRequests,
      
      activeUserId: initialData.seededUsers[0].id,
      
      setActiveUserId: (id: string) => set({ activeUserId: id }),
      
      resetDemoData: () => set({
        users: initialData.seededUsers,
        startups: initialData.seededStartups,
        snapshots: initialData.seededSnapshots,
        scores: initialData.seededScores,
        meetings: initialData.seededMeetings,
        flags: initialData.seededFlags,
        mentors: initialData.seededMentors,
        matchRequests: initialData.seededMatchRequests,
        matches: initialData.seededMatches,
        briefs: initialData.seededBriefs,
        patterns: initialData.seededPatterns,
        gateRequests: initialData.seededGateRequests,
        activeUserId: initialData.seededUsers[0].id,
      }),
    }),
    {
      name: 'fitt-portfolio-os-storage',
    }
  )
);
