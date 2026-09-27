import { Mentor, MCSector, MCExpertise, MCStage } from '@/types';

export const seededMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Prof. Aditi Sharma',
    title: 'Biotech Regulatory Expert',
    phone: '+919876543210',
    linkedin: 'linkedin.com/in/aditi',
    sectors: ['Healthcare', 'AgriTech'],
    expertise: ['Clinical Strategy', 'Regulatory & Compliance'],
    stages: ['Seed', 'Series A'],
    geography: 'Delhi',
    availability: 'HIGH',
    maxActiveMatches: 3,
    bio: 'Former FDA consultant with 20 years in medical device regulation.'
  },
  {
    id: 'm2',
    name: 'Rajesh Khanna',
    title: 'SaaS GTM Advisor',
    phone: '+919876543211',
    linkedin: 'linkedin.com/in/rajesh',
    sectors: ['AI/ML', 'DeepTech'],
    expertise: ['Go-to-Market', 'B2B Sales', 'Fundraising'],
    stages: ['Pre-Seed', 'Seed'],
    geography: 'Bangalore',
    availability: 'MEDIUM',
    maxActiveMatches: 2,
    bio: 'Scaled 3 SaaS startups to $10M ARR.'
  },
  {
    id: 'm3',
    name: 'Dr. Vikram Singh',
    title: 'Hardware & Supply Chain Specialist',
    phone: '+919876543212',
    linkedin: 'linkedin.com/in/vikram',
    sectors: ['DeepTech', 'Defence'],
    expertise: ['Supply Chain', 'IP & Patents', 'Product Strategy'],
    stages: ['Series A', 'Series B+'],
    geography: 'Pune',
    availability: 'LOW',
    maxActiveMatches: 4,
    bio: '25 years in semiconductor manufacturing and supply chain.'
  }
];
