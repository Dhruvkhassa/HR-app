// src/pages/CandidatesBoardPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Candidate } from '../db/db';
import './CandidatesPage.css';

const STAGES: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="candidate-card"
    >
      <h4>{candidate.name}</h4>
      <p>{candidate.email}</p>
    </div>
  );
}

function KanbanColumn({ stage, candidates }: { stage: string; candidates: Candidate[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const stageEmojis = {
    applied: '📝',
    screen: '📞',
    tech: '💻',
    offer: '💰',
    hired: '🎉',
    rejected: '❌'
  };

  return (
    <div 
      ref={setNodeRef} 
      className={`kanban-column ${isOver ? 'drag-over' : ''}`}
    >
      <h2 className="column-title">
        <span className="stage-title">
          <span className="stage-emoji">{stageEmojis[stage as keyof typeof stageEmojis]}</span>
          {stage}
        </span>
        <span className="candidate-count">{candidates.length}</span>
      </h2>
      <div className="column-cards">
        <SortableContext items={candidates.map(c => c.id!)} strategy={verticalListSortingStrategy}>
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>
        {candidates.length === 0 && (
          <div className="empty-column">
            <p>No candidates in this stage</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CandidatesBoardPage() {
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({});
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    async function fetchCandidates() {
      try {
        console.log('Fetching candidates for board...');
        const response = await fetch('/candidates?board=true');
        const data: Candidate[] = await response.json();
        console.log('Fetched candidates:', data.length, 'candidates');
        
        const grouped = STAGES.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {} as Record<string, Candidate[]>);
        data.forEach(c => {
          if (grouped[c.stage]) {
            grouped[c.stage].push(c);
          }
        });
        console.log('Grouped candidates:', grouped);
        setCandidates(grouped);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    }
    fetchCandidates();
  }, []);

  const handleDragStart = (event: any) => {
    console.log('🚀 DRAG STARTED:', event.active.id);
    const candidateId = event.active.id;
    const allCandidates = Object.values(candidates).flat();
    setActiveCandidate(allCandidates.find(c => c.id === candidateId) || null);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveCandidate(null);
    
    console.log('=== DRAG END DEBUG ===');
    console.log('Active ID:', active.id);
    console.log('Over ID:', over?.id);
    console.log('Over data:', over?.data);
    console.log('Active data:', active.data);

    if (!over) {
      console.log('❌ No drop target found');
      return;
    }

    // Find which container the active candidate is currently in
    let activeContainer = null;
    for (const [stage, stageCandidates] of Object.entries(candidates)) {
      if (stageCandidates.some(c => c.id === Number(active.id))) {
        activeContainer = stage;
        break;
      }
    }

    // Get the target container from the over item
    // If over.id is a candidate ID, find which stage contains that candidate
    // If over.id is a stage name, use it directly
    let overContainer = over.id;
    
    // Check if over.id is a candidate ID (number) or stage name (string)
    if (typeof over.id === 'number' || !isNaN(Number(over.id))) {
      // over.id is a candidate ID, find which stage contains this candidate
      for (const [stage, stageCandidates] of Object.entries(candidates)) {
        if (stageCandidates.some(c => c.id === Number(over.id))) {
          overContainer = stage;
          break;
        }
      }
    }

    console.log('Source container:', activeContainer);
    console.log('Target container:', overContainer);

    if (activeContainer === overContainer) {
      console.log('❌ Same container, no move needed');
      return;
    }

    const candidateId = Number(active.id);
    const candidateToMove = candidates[activeContainer]?.find(c => c.id === candidateId);

    console.log('Candidate to move:', candidateToMove);

    if (!candidateToMove) {
      console.log('❌ Candidate not found');
      return;
    }

    console.log('✅ Moving candidate:', candidateToMove.name, 'from', activeContainer, 'to', overContainer);

    // Update state immediately
    setCandidates(prev => {
      const newCandidates = { ...prev };
      
      // Remove from source
      newCandidates[activeContainer] = newCandidates[activeContainer].filter(c => c.id !== candidateId);
      
      // Add to target
      newCandidates[overContainer] = [...newCandidates[overContainer], { 
        ...candidateToMove, 
        stage: overContainer 
      }];
      
      console.log('✅ State updated:', newCandidates);
      return newCandidates;
    });

    // Update server
    try {
      const response = await fetch(`/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: overContainer }),
      });
      
      if (response.ok) {
        console.log('✅ Server updated successfully');
      } else {
        console.log('❌ Server update failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Server update error:', error);
    }
  };

  return (
    <div className="kanban-page">
      <header className="kanban-header">
        <nav className="kanban-nav">
          <Link to="/candidates" className="nav-link">
            <span className="nav-icon">←</span>
            Back to List View
          </Link>
        </nav>
        <div className="kanban-title-section">
          <h1>Candidates Board</h1>
          <p>Drag and drop candidates between hiring stages</p>
        </div>
        <div className="kanban-stats">
          <div className="stat-item">
            <span className="stat-number">{Object.values(candidates).flat().length}</span>
            <span className="stat-label">Total Candidates</span>
          </div>
        </div>
      </header>
      
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {STAGES.map(stage => (
            <KanbanColumn key={stage} stage={stage} candidates={candidates[stage] || []} />
          ))}
        </div>
        <DragOverlay>
          {activeCandidate ? (
            <div className="drag-overlay-card">
              <CandidateCard candidate={activeCandidate} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}