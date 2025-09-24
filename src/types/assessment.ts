// src/types/assessment.ts

// The different types of questions we support
export type QuestionType =
  | 'single-choice'
  | 'multi-choice'
  | 'short-text'
  | 'long-text'
  | 'numeric'
  | 'file-upload';

// Base interface that all questions share
export interface BaseQuestion {
  id: string; // Unique ID for each question
  type: QuestionType;
  prompt: string;
  required?: boolean; // Add required field
  maxLength?: number; // Add max length for text questions
  conditional?: {
    dependsOn: string; // ID of the question this depends on
    condition: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
    value: any; // Value to compare against
  };
}

// Interface for questions that have options (single-choice, multi-choice)
export interface ChoiceQuestion extends BaseQuestion {
  type: 'single-choice' | 'multi-choice';
  options: string[];
}

// Interface for simple text questions
export interface TextQuestion extends BaseQuestion {
  type: 'short-text' | 'long-text';
}

// Interface for numeric questions with range validation
export interface NumericQuestion extends BaseQuestion {
  type: 'numeric';
  min?: number;
  max?: number;
  step?: number;
}

// Interface for file upload questions
export interface FileUploadQuestion extends BaseQuestion {
  type: 'file-upload';
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

// A union type representing any possible question
export type Question = ChoiceQuestion | TextQuestion | NumericQuestion | FileUploadQuestion;