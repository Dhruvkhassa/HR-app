// src/pages/CandidateDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Candidate } from '../db/db';
import { CandidateNotes } from '../components/CandidateNotes';
import './CandidateDetailPage.css';

type TimelineEvent = {
  event: string;
  date: string;
};

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both candidate details and timeline concurrently
        const [candidateRes, timelineRes] = await Promise.all([
          fetch(`/api/candidates/${id}`),
          fetch(`/api/candidates/${id}/timeline`),
        ]);
        if (!candidateRes.ok) throw new Error('Candidate not found');

        const candidateData = await candidateRes.json();
        const timelineData = await timelineRes.json();
        
        setCandidate(candidateData);
        setTimeline(timelineData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpdateNotes = async (candidateId: number, notes: string) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      
      if (!response.ok) throw new Error('Failed to update notes');
      
      // Update local state
      setCandidate(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!candidate) return <div>Candidate not found. <Link to="/candidates">Go back</Link></div>;

  return (
    <div className="candidate-detail-page">
      <nav className="candidate-nav">
        <Link to="/candidates" className="nav-link">
          <span className="nav-icon">←</span>
          Back to Candidates
        </Link>
      </nav>

      <div className="candidate-header">
        <h1 className="candidate-name">{candidate.name}</h1>
        <p className="candidate-email">{candidate.email}</p>
        <p className="candidate-stage">Current Stage: {candidate.stage}</p>
      </div>

      <div className="timeline-section">
        <h2 className="section-title">Timeline</h2>
        <div className="timeline-list">
          {timeline.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-event">{item.event}</div>
              <div className="timeline-date">{item.date}</div>
            </div>
          ))}
        </div>
      </div>

      <CandidateNotes candidate={candidate} onUpdate={handleUpdateNotes} />
    </div>
  );
}