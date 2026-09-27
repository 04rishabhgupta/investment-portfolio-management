'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { MockCopilot } from './MockCopilot';

export interface CopilotContextType {
  draftMeetingNote: (transcript: string) => Promise<{
    wins: string[];
    challenges: string[];
    dataUpdate: string;
    commitments: { owner: string; text: string; due: string }[];
    suggestedSoftFlags: string[];
  }>;
  draftSectorBriefStep: (stepNo: number, startupContext: any) => Promise<any>;
  generateQuestions: (context: any) => Promise<string[]>;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
}

export function CopilotProvider({ children }: { children: ReactNode }) {
  return (
    <CopilotContext.Provider value={MockCopilot}>
      {children}
    </CopilotContext.Provider>
  );
}
