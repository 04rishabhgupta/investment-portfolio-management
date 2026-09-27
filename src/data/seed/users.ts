import { User } from '@/types';

export const seededUsers: User[] = [
  { id: 'pm1', name: 'Ananya Rao', role: 'PM' },
  { id: 'pm2', name: 'Rahul Sharma', role: 'PM' },
  { id: 'pm3', name: 'Sneha Patel', role: 'PM' },
  { id: 'pm4', name: 'Karan Singh', role: 'PM' },
  { id: 'spm1', name: 'Vikram Mehta', role: 'SENIOR_PM' },
  { id: 'ph1', name: 'Dr. Meera Iyer', role: 'PROGRAM_HEAD' },
  { id: 'founder1', name: 'Dr. Aarav Gupta', role: 'FOUNDER', assignedStartupId: 's1' },
  { id: 'admin1', name: 'Admin', role: 'ADMIN' },
];
