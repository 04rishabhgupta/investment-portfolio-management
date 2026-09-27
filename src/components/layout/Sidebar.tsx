'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Flag, Calendar, GitPullRequest, Lightbulb, UserCheck, ShieldAlert, BarChart } from 'lucide-react';
import { useActiveUser } from '@/lib/store/selectors';

export function Sidebar() {
  const pathname = usePathname();
  const user = useActiveUser();

  const isFounder = user.role === 'FOUNDER';

  const pmLinks = [
    { href: '/command-center', label: 'Command Center', icon: Home },
    { href: '/startups', label: 'Portfolio', icon: Briefcase },
    { href: '/flags', label: 'Early Warnings', icon: Flag },
    { href: '/meetings', label: 'Meetings', icon: Calendar },
    { href: '/gates', label: 'Stage Gates', icon: GitPullRequest },
    { href: '/mentor-connect', label: 'Mentor Connect', icon: UserCheck },
    { href: '/sector-intel', label: 'Sector Intel', icon: Lightbulb },
    { href: '/patterns', label: 'Patterns', icon: BarChart },
  ];

  const founderLinks = [
    { href: '/founder', label: 'Founder Portal', icon: Home },
    { href: '/founder/mentor-connect', label: 'Mentor Connect', icon: UserCheck },
  ];

  const links = isFounder ? founderLinks : pmLinks;

  return (
    <div className="w-64 bg-[#101C33] text-[#F4F6F9] flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">FITT Portfolio OS</h1>
        <div className="mt-1 text-xs text-slate-400">Foundation for Innovation & Tech Transfer</div>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-[#14306B] text-white' : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      {user.role === 'ADMIN' && (
        <div className="p-4 border-t border-[#1E293B]">
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-300 hover:bg-[#1E293B] hover:text-white">
            <ShieldAlert size={18} />
            <span>Admin Settings</span>
          </Link>
        </div>
      )}
      <div className="p-4 text-[10px] text-slate-500/50 text-center uppercase tracking-widest border-t border-[#1E293B]">
        Crafted by Rishabh Gupta<br/>for Someone Special
      </div>
    </div>
  );
}
