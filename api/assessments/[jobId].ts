import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock assessments data
const mockAssessments = {
  1: {
    id: 1,
    jobId: 1,
    title: 'Frontend Developer Assessment',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the main purpose of React hooks?',
        options: [
          'To manage component state and side effects',
          'To create reusable components',
          'To handle routing in React applications',
          'To optimize performance'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        id: 'q2',
        type: 'text',
        question: 'Explain the difference between controlled and uncontrolled components in React.',
        correctAnswer: 'Controlled components have their state managed by React, while uncontrolled components manage their own state internally.',
        points: 15
      },
      {
        id: 'q3',
        type: 'code',
        question: 'Write a React component that displays a counter with increment and decrement buttons.',
        language: 'javascript',
        points: 25
      }
    ],
    timeLimit: 30,
    passingScore: 70
  },
  2: {
    id: 2,
    jobId: 2,
    title: 'Full Stack Developer Assessment',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which HTTP method is typically used for creating new resources?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 1,
        points: 10
      },
      {
        id: 'q2',
        type: 'text',
        question: 'What is the difference between SQL and NoSQL databases?',
        correctAnswer: 'SQL databases are relational and use structured schemas, while NoSQL databases are non-relational and use flexible schemas.',
        points: 15
      }
    ],
    timeLimit: 45,
    passingScore: 75
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { jobId } = req.query;
    
    if (!jobId) {
      res.status(400).json({ message: 'Job ID is required' });
      return;
    }
    
    const assessment = mockAssessments[parseInt(jobId as string)];
    
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }
    
    res.status(200).json(assessment);
  } else if (req.method === 'POST') {
    const { jobId } = req.query;
    
    if (!jobId) {
      res.status(400).json({ message: 'Job ID is required' });
      return;
    }
    
    const newAssessment = {
      id: Object.keys(mockAssessments).length + 1,
      jobId: parseInt(jobId as string),
      ...req.body
    };
    
    mockAssessments[parseInt(jobId as string)] = newAssessment;
    res.status(201).json(newAssessment);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
