import { http, HttpResponse } from 'msw';
import { db } from '../db/db';
import { type Candidate, type Job } from '../db/db';

export const handlers = [
  // --- JOB HANDLERS ---
  http.get('/jobs', async ({ request }) => {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search');
      const status = url.searchParams.get('status');
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      const sort = url.searchParams.get('sort') || 'order';
      
      let query = db.jobs.toCollection();
      if (status) {
        query = query.filter((job) => job.status === status);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        query = query.filter((job) =>
          job.title.toLowerCase().includes(searchLower)
        );
      }
      
      const allJobs = await query.sortBy(sort);
      const total = allJobs.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const jobs = allJobs.slice(startIndex, endIndex);
      
      return HttpResponse.json({
        data: jobs,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasNext: endIndex < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      return HttpResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
    }
  }),
  http.get('/jobs/:id', async ({ params }) => {
    try {
      const { id } = params;
      const job = await db.jobs.get(Number(id));
      if (job) {
        return HttpResponse.json(job);
      }
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    } catch (error) {
      return HttpResponse.json({ message: 'Error fetching job' }, { status: 500 });
    }
  }),
  http.post('/jobs', async ({ request }) => {
    try {
      const newJob = (await request.json()) as Job;
      const id = await db.jobs.add(newJob);
      return HttpResponse.json({ ...newJob, id }, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ message: 'Error creating job' }, { status: 500 });
    }
  }),
  http.patch('/jobs/:id', async ({ request, params }) => {
    try {
      const { id } = params;
      const updates = (await request.json()) as Partial<Job>;
      console.log('[MSW] PATCH /jobs/:id - Job ID:', id, 'Updates:', updates);
      console.log('[MSW] Request URL:', request.url);
      
      const jobId = Number(id);
      
      // Debug: List all existing jobs
      const allJobs = await db.jobs.toArray();
      console.log('[MSW] All existing jobs:', allJobs.map(j => ({ id: j.id, title: j.title })));
      
      const jobExists = await db.jobs.get(jobId);
      console.log('[MSW] Job exists before update:', jobExists);
      
      if (!jobExists) {
        console.log('[MSW] Job not found, returning 404');
        return new HttpResponse(null, { status: 404, statusText: 'Job not found' });
      }
      
      await db.jobs.update(jobId, updates);
      const updatedJob = await db.jobs.get(jobId);
      console.log('[MSW] Updated job:', updatedJob);
      
      return HttpResponse.json(updatedJob);
    } catch (error) {
      console.error('[MSW] Error updating job:', error);
      return HttpResponse.json({ message: 'Error updating job' }, { status: 500 });
    }
  }),
  http.patch('/jobs/:id/reorder', async () => {
    if (Math.random() < 0.3) {
      console.error('[MSW] Simulating 500 Internal Server Error for reorder');
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }
    console.log('[MSW] Job reorder successful');
    return HttpResponse.json({ success: true });
  }),

  // --- CANDIDATE HANDLERS ---
  http.get('/candidates', async ({ request }) => {
    try {
      const url = new URL(request.url);
      const stage = url.searchParams.get('stage');
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
      const search = url.searchParams.get('search');
      const boardView = url.searchParams.get('board') === 'true';
      
      let allCandidates = await db.candidates.toArray();
      
      // Apply stage filter
      if (stage) {
        allCandidates = allCandidates.filter(c => c.stage === stage);
      }
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        allCandidates = allCandidates.filter(c => 
          c.name.toLowerCase().includes(searchLower) || 
          c.email.toLowerCase().includes(searchLower)
        );
      }
      
      // For board view, return all candidates without pagination
      if (boardView) {
        return HttpResponse.json(allCandidates);
      }
      
      const total = allCandidates.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const candidates = allCandidates.slice(startIndex, endIndex);
      
      return HttpResponse.json({
        data: candidates,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasNext: endIndex < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('[MSW] Error fetching candidates:', error);
      return HttpResponse.json({ message: 'Error fetching candidates' }, { status: 500 });
    }
  }),
  http.get('/candidates/:id', async ({ params }) => {
    try {
      const { id } = params;
      const candidate = await db.candidates.get(Number(id));
      if (candidate) {
        return HttpResponse.json(candidate);
      }
      return new HttpResponse(null, { status: 404 });
    } catch (error) {
      return HttpResponse.json({ message: 'Error fetching candidate' }, { status: 500 });
    }
  }),
  http.get('/candidates/:id/timeline', async () => {
    const mockTimeline = [
      { event: 'Applied for role', date: '2025-09-20' },
      { event: 'Moved to Screen stage', date: '2025-09-21' },
      { event: 'Moved to Tech stage', date: '2025-09-23' },
    ];
    return HttpResponse.json(mockTimeline);
  }),
  http.patch('/candidates/:id', async ({ request, params }) => {
    try {
      const { id } = params;
      const updates = await request.json() as { stage?: Candidate['stage']; notes?: string };
      if (updates.stage) {
        await db.candidates.update(Number(id), { stage: updates.stage });
      }
      if (updates.notes !== undefined) {
        await db.candidates.update(Number(id), { notes: updates.notes });
      }
      const updatedCandidate = await db.candidates.get(Number(id));
      return HttpResponse.json(updatedCandidate);
    } catch (error) {
      return HttpResponse.json({ message: 'Error updating candidate' }, { status: 500 });
    }
  }),

  // --- ASSESSMENT HANDLERS ---
  http.get('/assessments/:jobId', async ({ params }) => {
    const jobId = Number(params.jobId);
    try {
      const assessment = await db.assessments.where({ jobId }).first();
      if (assessment) {
        return HttpResponse.json(assessment);
      }
      return new HttpResponse(null, { status: 404 });
    } catch (error) {
      return HttpResponse.json({ message: 'Error fetching assessment' }, { status: 500 });
    }
  }),
  http.put('/assessments/:jobId', async ({ request, params }) => {
    const jobId = Number(params.jobId);
    try {
      const { questions } = await request.json() as { questions: any[] };
      await db.assessments.put({
        jobId,
        questions,
      });
      const newAssessment = await db.assessments.where({ jobId }).first();
      return HttpResponse.json(newAssessment, { status: 200 });
    } catch (error) {
      return HttpResponse.json({ message: 'Error saving assessment' }, { status: 500 });
    }
  }),

  // --- ASSESSMENT SUBMISSION HANDLER ---
  http.post('/assessments/:jobId/submit', async ({ request, params }) => {
    const jobId = Number(params.jobId);
    try {
      const { answers } = await request.json() as { answers: Record<string, any> };
      
      // Save the assessment response to the database
      await db.assessmentResponses.add({
        jobId,
        answers,
        submittedAt: new Date(),
      });
      
      return HttpResponse.json({ 
        message: 'Assessment submitted successfully',
        submissionId: Date.now() // Simple ID generation
      }, { status: 200 });
    } catch (error) {
      return HttpResponse.json({ message: 'Error submitting assessment' }, { status: 500 });
    }
  }),
];