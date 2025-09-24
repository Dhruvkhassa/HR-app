import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Job } from '../db/db';
import { type Question } from '../types/assessment';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

export function AssessmentTakePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toasts, success, error, removeToast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const [jobRes, assessmentRes] = await Promise.all([
          fetch(`/jobs/${jobId}`),
          fetch(`/assessments/${jobId}`),
        ]);

        if (!jobRes.ok) throw new Error('Job not found');
        const jobData = await jobRes.json();
        setJob(jobData);

        if (assessmentRes.ok) {
          // FIX: Changed 'assessment' to 'assessmentRes' to match the variable name
          const assessmentData = await assessmentRes.json();
          setQuestions(assessmentData.questions);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [jobId]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Submission failed' }));
        throw new Error(errorData.message || 'Submission failed');
      }
      
      const result = await response.json();
      
      success(
        'Assessment Submitted Successfully!',
        'Thank you for completing the assessment. Your responses have been recorded.'
      );
      
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      error(
        'Submission Failed',
        error instanceof Error ? error.message : 'There was an error submitting your assessment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading Assessment...</div>;
  if (!job) return <div>This job could not be found.</div>;

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
        <h1>Apply for: {job.title}</h1>
        <p>Please complete the following questions.</p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <QuestionRenderer
                key={q.id}
                question={q}
                index={index}
                answer={answers[q.id]}
                onAnswerChange={handleAnswerChange}
                allAnswers={answers}
              />
            ))
          ) : (
            <p>This job does not currently have an assessment configured.</p>
          )}

          {questions.length > 0 && (
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '2rem', backgroundColor: '#2a9d8f', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </form>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

