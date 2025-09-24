import { faker } from '@faker-js/faker';
import { db, type Job, type Candidate, type Assessment } from './db';
import { type Question } from '../types/assessment';

export async function seedDatabase() {
  // --- Seed Jobs ---
  const jobCount = await db.jobs.count();
  if (jobCount === 0) {
    console.log('Seeding jobs...');
    const jobsToSeed: Job[] = [];
    const jobTitles = Array.from({ length: 25 }, () => faker.person.jobTitle());
    const uniqueJobTitles = [...new Set(jobTitles)]; // Ensure unique titles for unique slugs

    for (let i = 0; i < uniqueJobTitles.length; i++) {
      const title = uniqueJobTitles[i];
      jobsToSeed.push({
        title: title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        status: faker.helpers.arrayElement(['active', 'archived']),
        tags: faker.helpers.arrayElements(['Full-time', 'Remote', 'Contract', 'Engineering', 'Marketing'], { min: 1, max: 3 }),
        order: i,
      });
    }
    await db.jobs.bulkAdd(jobsToSeed);
    console.log('Jobs seeded successfully!');
  } else {
    console.log('Jobs already seeded.');
  }

  // --- Seed Candidates ---
  const candidateCount = await db.candidates.count();
  console.log('Current candidate count:', candidateCount);
  if (candidateCount === 0) {
    console.log('Seeding 1000 candidates...');
    const allJobs = await db.jobs.toArray();
    console.log('Available jobs for seeding:', allJobs.length);
    if (allJobs.length === 0) {
        console.error("Cannot seed candidates without jobs.");
        return;
    }

    const candidatesToSeed: Candidate[] = [];
    const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

    for (let i = 0; i < 1000; i++) {
      candidatesToSeed.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        jobId: faker.helpers.arrayElement(allJobs).id!,
        stage: faker.helpers.arrayElement(stages),
      });
    }
    console.log('About to seed', candidatesToSeed.length, 'candidates');
    await db.candidates.bulkAdd(candidatesToSeed);
    console.log('Candidates seeded successfully!');
    const newCount = await db.candidates.count();
    console.log('New candidate count:', newCount);
  } else {
    console.log('Candidates already seeded.');
  }

  // --- Seed Assessments ---
  const assessmentCount = await db.assessments.count();
  if (assessmentCount === 0) {
    console.log('Seeding assessments...');
    const allJobs = await db.jobs.toArray();
    if (allJobs.length === 0) {
      console.error("Cannot seed assessments without jobs.");
      return;
    }

    const assessmentsToSeed: Assessment[] = [];
    
    // Create 3 assessments with 10+ questions each
    for (let i = 0; i < 3; i++) {
      const job = allJobs[i];
      const questions: Question[] = [
        // Single choice questions
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          prompt: 'What is your preferred work environment?',
          options: ['Remote', 'Hybrid', 'On-site', 'Flexible']
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          prompt: 'How many years of experience do you have in this field?',
          options: ['0-1 years', '2-3 years', '4-5 years', '6+ years']
        },
        // Multi-choice questions
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          prompt: 'Which technologies are you familiar with? (Select all that apply)',
          options: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'TypeScript']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          prompt: 'What are your areas of expertise?',
          options: ['Frontend Development', 'Backend Development', 'Full Stack', 'DevOps', 'UI/UX Design', 'Testing', 'Project Management']
        },
        // Short text questions
        {
          id: crypto.randomUUID(),
          type: 'short-text',
          prompt: 'What is your current job title?',
          required: true,
          maxLength: 100
        },
        {
          id: crypto.randomUUID(),
          type: 'short-text',
          prompt: 'What is your expected salary range?',
          required: false,
          maxLength: 50
        },
        // Long text questions
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          prompt: 'Tell us about a challenging project you worked on and how you overcame the obstacles.',
          required: true,
          maxLength: 1000
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          prompt: 'Why are you interested in this position and our company?',
          required: true,
          maxLength: 500
        },
        // Numeric questions
        {
          id: crypto.randomUUID(),
          type: 'numeric',
          prompt: 'Rate your proficiency in the main technology stack (1-10)',
          min: 1,
          max: 10,
          step: 1
        },
        {
          id: crypto.randomUUID(),
          type: 'numeric',
          prompt: 'How many team members have you managed in your previous roles?',
          min: 0,
          max: 50,
          step: 1
        },
        // File upload questions
        {
          id: crypto.randomUUID(),
          type: 'file-upload',
          prompt: 'Please upload your resume',
          acceptedTypes: ['.pdf', '.doc', '.docx'],
          maxSize: 5
        },
        {
          id: crypto.randomUUID(),
          type: 'file-upload',
          prompt: 'Upload a portfolio or sample of your work',
          acceptedTypes: ['.pdf', '.zip', '.jpg', '.png'],
          maxSize: 10
        }
      ];

      assessmentsToSeed.push({
        jobId: job.id!,
        questions: questions
      });
    }

    await db.assessments.bulkAdd(assessmentsToSeed);
    console.log('Assessments seeded successfully!');
  } else {
    console.log('Assessments already seeded.');
  }
}