import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock data for individual job
const mockJob = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  salary: '$120,000 - $150,000',
  status: 'active',
  description: 'We are looking for a senior frontend developer with extensive experience in React and TypeScript. You will be responsible for building and maintaining our core web applications.',
  requirements: ['React', 'TypeScript', '5+ years experience', 'CSS/SCSS', 'Git'],
  order: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
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
    const { id } = req.query;
    
    if (!id) {
      res.status(400).json({ message: 'Job ID is required' });
      return;
    }
    
    const jobId = parseInt(id as string);
    const job = mockJob.id === jobId ? mockJob : null;
    
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    res.status(200).json(job);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    
    if (!id) {
      res.status(400).json({ message: 'Job ID is required' });
      return;
    }
    
    const jobId = parseInt(id as string);
    if (mockJob.id !== jobId) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    
    const updatedJob = {
      ...mockJob,
      ...req.body,
      id: jobId,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json(updatedJob);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
