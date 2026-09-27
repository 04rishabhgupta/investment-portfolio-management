import { useAppStore } from './useAppStore';

export const useActiveUser = () => {
  const users = useAppStore(state => state.users);
  const activeUserId = useAppStore(state => state.activeUserId);
  return users.find(u => u.id === activeUserId)!;
};

export const useVisibleStartups = () => {
  const startups = useAppStore(state => state.startups);
  const user = useActiveUser();

  if (user.role === 'FOUNDER') {
    return startups.filter(s => s.id === user.assignedStartupId);
  }
  if (user.role === 'PM') {
    return startups.filter(s => s.pmId === user.id);
  }
  // Senior PM, Program Head, Admin see all startups by default in demo
  return startups;
};
