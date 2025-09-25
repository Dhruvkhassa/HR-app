import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock data - in a real app, this would come from a database
const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    status: 'active',
    description: 'We are looking for a senior frontend developer...',
    requirements: ['React', 'TypeScript', '5+ years experience'],
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    status: 'active',
    description: 'Join our growing team as a full stack engineer...',
    requirements: ['Node.js', 'React', 'PostgreSQL'],
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Austin, TX',
    salary: '$110,000 - $140,000',
    status: 'archived',
    description: 'Looking for an experienced DevOps engineer...',
    requirements: ['AWS', 'Docker', 'Kubernetes'],
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    const { search, status, page = '1', pageSize = '10', sort = 'order' } = req.query;
    
    let filteredJobs = [...mockJobs];
    
    // Apply status filter
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort jobs
    if (sort === 'order') {
      filteredJobs.sort((a, b) => a.order - b.order);
    }
    
    // Apply pagination
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const startIndex = (pageNum - 1) * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    
    res.status(200).json({
      data: paginatedJobs,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / pageSizeNum),
        hasNext: endIndex < filteredJobs.length,
        hasPrev: pageNum > 1
      }
    });
  } else if (req.method === 'POST') {
    const newJob = {
      id: mockJobs.length + 1,
      ...req.body,
      order: mockJobs.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockJobs.push(newJob);
    res.status(201).json(newJob);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
