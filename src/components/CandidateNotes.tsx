import { useState, useEffect } from 'react';
import { type Candidate } from '../db/db';

interface CandidateNotesProps {
  candidate: Candidate;
  onUpdate: (candidateId: number, notes: string) => void;
}

// Mock list of team members for @mentions
const TEAM_MEMBERS = [
  'John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 
  'David Wilson', 'Lisa Brown', 'Tom Anderson', 'Amy Taylor'
];

export function CandidateNotes({ candidate, onUpdate }: CandidateNotesProps) {
  const [notes, setNotes] = useState(candidate.notes || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    setNotes(candidate.notes || '');
  }, [candidate.notes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setNotes(value);
    setCursorPosition(cursorPos);

    // Check for @mentions
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setShowSuggestions(true);
        setSuggestionIndex(lastAtIndex);
        return;
      }
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Handle arrow down for suggestions
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Handle arrow up for suggestions
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        // Insert first suggestion
        insertMention(TEAM_MEMBERS[0]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  const insertMention = (name: string) => {
    const textBeforeCursor = notes.substring(0, cursorPosition);
    const textAfterCursor = notes.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    const newText = textBeforeCursor.substring(0, lastAtIndex) + 
                   `@${name} ` + 
                   textAfterCursor;
    
    setNotes(newText);
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        const newCursorPos = lastAtIndex + name.length + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    onUpdate(candidate.id!, notes);
  };

  const filteredSuggestions = TEAM_MEMBERS.filter(member => 
    member.toLowerCase().includes(
      notes.substring(suggestionIndex + 1, cursorPosition).toLowerCase()
    )
  );

  return (
    <div className="candidate-notes">
      <h3>Notes & Comments</h3>
      <div className="notes-container">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          onKeyDown={handleKeyDown}
          placeholder="Add notes about this candidate... Use @ to mention team members"
          className="notes-textarea"
        />
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="mention-suggestions">
            {filteredSuggestions.map((member, index) => (
              <div
                key={member}
                className="mention-suggestion"
                onClick={() => insertMention(member)}
              >
                @{member}
              </div>
            ))}
          </div>
        )}
        
        <div className="notes-actions">
          <button onClick={handleSave} className="save-notes-btn">
            Save Notes
          </button>
          <div className="notes-info">
            Use @ to mention team members
          </div>
        </div>
      </div>
    </div>
  );
}
