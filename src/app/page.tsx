'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const users = useAppStore(state => state.users);
  const setActiveUserId = useAppStore(state => state.setActiveUserId);
  const router = useRouter();

  const handleSelectUser = (userId: string, role: string) => {
    setActiveUserId(userId);
    if (role === 'FOUNDER') {
      router.push('/founder');
    } else {
      router.push('/command-center');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-[#101C33] mb-4">Welcome to FITT Portfolio OS</h1>
        <p className="text-slate-500 text-lg">Select a persona to start the demo</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map(user => (
          <Card key={user.id} className="hover:border-[#14306B] transition-colors cursor-pointer" onClick={() => handleSelectUser(user.id, user.role)}>
            <CardHeader>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.role.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#14306B] hover:bg-[#14306B]/90">
                Log in as {user.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
