'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { useActiveUser } from '@/lib/store/selectors';
import { format } from 'date-fns';
import { getDemoDate } from '@/lib/clock';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MonitorPlay } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TopBar() {
  const users = useAppStore(state => state.users);
  const activeUser = useActiveUser();
  const setActiveUserId = useAppStore(state => state.setActiveUserId);
  const router = useRouter();

  const handleRoleChange = (userId: string | null) => {
    if (!userId) return;
    setActiveUserId(userId);
    const newUser = users.find(u => u.id === userId)!;
    if (newUser.role === 'FOUNDER') {
      router.push('/founder');
    } else {
      router.push('/command-center');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="bg-[#F4F6F9] text-[#101C33] flex items-center space-x-1 px-3 py-1">
          <MonitorPlay size={14} className="mr-2" />
          Demo Mode
        </Badge>
        <div className="flex items-center text-sm text-slate-500">
          <CalendarIcon size={14} className="mr-2" />
          Demo Date: {format(getDemoDate(), 'd MMM yyyy')}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-sm text-slate-500">Viewing as:</span>
        <Select value={activeUser.id} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {users.map(u => (
              <SelectItem key={u.id} value={u.id}>
                {u.name} ({u.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
