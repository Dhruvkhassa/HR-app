import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock candidates data
const mockCandidates = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    resume: 'john_doe_resume.pdf',
    stage: 'applied',
    jobId: 1,
    appliedAt: new Date().toISOString(),
    notes: 'Strong background in React and TypeScript',
    score: 85
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 234-5678',
    resume: 'jane_smith_resume.pdf',
    stage: 'screen',
    jobId: 1,
    appliedAt: new Date().toISOString(),
    notes: 'Excellent communication skills',
    score: 92
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1 (555) 345-6789',
    resume: 'mike_johnson_resume.pdf',
    stage: 'tech',
    jobId: 2,
    appliedAt: new Date().toISOString(),
    notes: 'Full stack experience',
    score: 78
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 456-7890',
    resume: 'sarah_wilson_resume.pdf',
    stage: 'offer',
    jobId: 1,
    appliedAt: new Date().toISOString(),
    notes: 'Perfect cultural fit',
    score: 95
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1 (555) 567-8901',
    resume: 'david_brown_resume.pdf',
    stage: 'hired',
    jobId: 2,
    appliedAt: new Date().toISOString(),
    notes: 'Started last week',
    score: 88
  }
];

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
    const { stage, page = '1', pageSize = '20', search, board } = req.query;
    
    let filteredCandidates = [...mockCandidates];
    
    // Apply stage filter
    if (stage && stage !== 'all') {
      filteredCandidates = filteredCandidates.filter(c => c.stage === stage);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredCandidates = filteredCandidates.filter(c => 
        c.name.toLowerCase().includes(searchLower) || 
        c.email.toLowerCase().includes(searchLower)
      );
    }
    
    // For board view, return all candidates without pagination
    if (board === 'true') {
      res.status(200).json({
        data: filteredCandidates,
        pagination: {
          page: 1,
          pageSize: filteredCandidates.length,
          total: filteredCandidates.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      });
      return;
    }
    
    // Apply pagination
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const startIndex = (pageNum - 1) * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);
    
    res.status(200).json({
      data: paginatedCandidates,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total: filteredCandidates.length,
        totalPages: Math.ceil(filteredCandidates.length / pageSizeNum),
        hasNext: endIndex < filteredCandidates.length,
        hasPrev: pageNum > 1
      }
    });
  } else if (req.method === 'POST') {
    const newCandidate = {
      id: mockCandidates.length + 1,
      ...req.body,
      appliedAt: new Date().toISOString(),
      score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
    };
    mockCandidates.push(newCandidate);
    res.status(201).json(newCandidate);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
