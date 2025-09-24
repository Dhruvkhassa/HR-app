import { useState, useEffect } from 'react';
import { type Candidate } from '../db/db';
import './CandidateNotes.css';

interface CandidateNotesProps {
  candidate: Candidate;
  onNotesChange?: (notes: string) => void;
  onUpdate?: (candidateId: number, notes: string) => Promise<void>;
}

export function CandidateNotes({ candidate, onNotesChange, onUpdate }: CandidateNotesProps) {
  const [notes, setNotes] = useState(candidate.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(candidate.notes || '');
  }, [candidate.notes]);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // Use onUpdate if provided, otherwise use onNotesChange
      if (onUpdate && candidate.id) {
        await onUpdate(candidate.id, notes);
      } else {
        onNotesChange?.(notes);
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  return (
    <div className="candidate-notes">
      <h3>Notes</h3>
      <div className="notes-container">
        <textarea
          className="notes-textarea"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add notes about this candidate..."
        />
      </div>
      <div className="notes-actions">
        <button
          className="save-notes-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Notes'}
        </button>
        <div className="notes-info">
          Notes for {candidate.name}
        </div>
      </div>
    </div>
  );
}