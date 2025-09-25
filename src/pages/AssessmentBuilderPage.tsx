// src/pages/AssessmentBuilderPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Job } from '../db/db';
import { type Question, type QuestionType } from '../types/assessment';
import { QuestionEditor } from '../components/QuestionEditor';
import { QuestionRenderer } from '../components/QuestionRenderer';
import './AssessmentBuilderPage.css';

const QUESTION_TYPES: QuestionType[] = [
  'single-choice',
  'multi-choice',
  'short-text',
  'long-text',
  'numeric',
  'file-upload',
];

export function AssessmentBuilderPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobRes, assessmentRes] = await Promise.all([
          fetch(`/api/jobs/${jobId}`),
          fetch(`/api/assessments/${jobId}`),
        ]);

        if (!jobRes.ok) throw new Error('Job not found');
        const jobData = await jobRes.json();
        setJob(jobData);

        if (assessmentRes.ok) {
          const assessmentData = await assessmentRes.json();
          setQuestions(assessmentData.questions);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId]);

  const handleSaveAssessment = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });
      if (!response.ok) throw new Error('Failed to save');
      alert('Assessment saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = (type: QuestionType) => {
    let newQuestion: Question;
    if (type === 'single-choice' || type === 'multi-choice') {
      newQuestion = {
        id: crypto.randomUUID(),
        type: type,
        prompt: 'New Question',
        options: ['Option 1'],
      };
    } else if (type === 'numeric') {
      newQuestion = {
        id: crypto.randomUUID(),
        type: 'numeric',
        prompt: 'New Numeric Question',
        min: 0,
        max: 100,
        step: 1,
      };
    } else if (type === 'file-upload') {
      newQuestion = {
        id: crypto.randomUUID(),
        type: 'file-upload',
        prompt: 'Upload File',
        acceptedTypes: ['.pdf', '.doc', '.docx'],
        maxSize: 5,
      };
    } else {
      newQuestion = {
        id: crypto.randomUUID(),
        type: type,
        prompt: 'New Question',
        required: false,
        maxLength: type === 'short-text' ? 100 : type === 'long-text' ? 1000 : undefined,
      };
    }
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
  };

  if (loading) return <div>Loading assessment builder...</div>;
  if (!job) return <div>Job not found. <Link to="/jobs">Go back</Link></div>;

  return (
    <div className="builder-page">
      <header className="builder-header">
        <div>
          <Link to={`/jobs/${jobId}`}>&larr; Back to Job</Link>
          <h1>Assessment for: {job.title}</h1>
        </div>
        <button onClick={handleSaveAssessment} className="btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Assessment'}
        </button>
      </header>

      <div className="builder-container">
        <aside className="builder-controls">
          <h2>Controls</h2>
          <div className="controls-list">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type}
                className="btn-add-question"
                onClick={() => handleAddQuestion(type)}
              >
                + Add {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </aside>

        <main className="builder-editor">
          <h2>Editor</h2>
          <div className="questions-list">
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <QuestionEditor
                  key={q.id}
                  question={q}
                  index={index}
                  onUpdate={handleUpdateQuestion}
                  onDelete={handleDeleteQuestion}
                />
              ))
            ) : (
              <p>No questions yet. Add one from the controls panel.</p>
            )}
          </div>
        </main>

        <aside className="builder-preview">
          <h2>Live Preview</h2>
          <div className="preview-form">
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <QuestionRenderer 
                  key={q.id} 
                  question={q} 
                  index={index} 
                  allAnswers={{}} // Empty answers for preview
                />
              ))
            ) : (
              <p>The form preview will appear here.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}