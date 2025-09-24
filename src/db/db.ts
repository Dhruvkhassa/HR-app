import Dexie, { type Table } from 'dexie';

// Interfaces for our data structures
export interface Job {
  id?: number;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
}

export interface Candidate {
  id?: number;
  name: string;
  email: string;
  jobId: number;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  notes?: string; // Add notes field
}

export interface Assessment {
  id?: number;
  jobId: number;
  questions: any[];
}

// New interface for storing submitted answers
export interface AssessmentResponse {
  id?: number;
  jobId: number;
  answers: Record<string, any>; // Stores answers as { questionId: answer }
  submittedAt: Date;
}

class TalentFlowDB extends Dexie {
  jobs!: Table<Job, number>;
  candidates!: Table<Candidate, number>;
  assessments!: Table<Assessment, number>;
  assessmentResponses!: Table<AssessmentResponse, number>; // New table

  constructor() {
    super('talentFlowDatabase');
    // Version 3 of the database, includes notes field for candidates
    this.version(3).stores({
      jobs: '++id, slug, status, order',
      candidates: '++id, jobId, stage, email',
      assessments: '++id, jobId',
      assessmentResponses: '++id, jobId, submittedAt',
    });
    // Version 2 of the database, includes assessment responses
    this.version(2).stores({
      jobs: '++id, slug, status, order',
      candidates: '++id, jobId, stage, email',
      assessments: '++id, jobId',
      assessmentResponses: '++id, jobId, submittedAt',
    });
    // The original schema for backward compatibility
    this.version(1).stores({
        jobs: '++id, slug, status, order',
        candidates: '++id, jobId, stage, email',
        assessments: '++id, jobId',
    });
  }
}

export const db = new TalentFlowDB();
