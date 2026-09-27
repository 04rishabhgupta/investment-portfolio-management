import { Sector, Stage, MCSector, MCStage } from '@/types';

export const sectorMapping: Record<Sector, MCSector[]> = {
  'AI_ML': ['AI/ML'],
  'MEDTECH_BIOTECH': ['Healthcare', 'DeepTech'],
  'AGRITECH': ['AgriTech'],
  'CYBERSECURITY': ['Cybersecurity'],
  'UAV_AUTONOMOUS': ['Defence', 'DeepTech'],
  'SEMICONDUCTOR_HARDWARE': ['DeepTech']
};

export const stageMapping: Record<Stage, MCStage[]> = {
  'PRE_INCUBATION': ['Ideation'],
  'EARLY_INCUBATION': ['Ideation'],
  'MID_INCUBATION': ['Pre-Seed'],
  'LATE_INCUBATION': ['Pre-Seed'],
  'ACCELERATION': ['Seed', 'Series A'],
  'INVESTMENT_PORTFOLIO': ['Seed', 'Series A'],
  'GRADUATION': ['Series A', 'Series B+'],
  'DORMANT': [],
  'WIND_DOWN': []
};
