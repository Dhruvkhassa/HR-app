import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Job } from '../db/db';

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Job not found');
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (loading) return <div>Loading job details...</div>;
  if (!job) return <div>Job not found. <Link to="/">Go back</Link></div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/jobs">&larr; Back to Jobs Board</Link>
        <div>
          <Link to={`/jobs/${jobId}/assessment`} className="nav-link" style={{backgroundColor: '#444', marginRight: '1rem', color: '#eee', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '6px'}}>
            Manage Assessment
          </Link>
          <Link to={`/jobs/${jobId}/apply`} className="nav-link" style={{backgroundColor: '#2a9d8f', color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '6px'}}>
            Apply Now &rarr;
          </Link>
        </div>
      </nav>
      <h1>{job.title}</h1>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Tags:</strong> {job.tags.join(', ')}</p>
    </div>
  );
}
