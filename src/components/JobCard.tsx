import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Job } from '../db/db';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onStatusToggle: (job: Job) => void;
}

export function JobCard({ job, onEdit, onStatusToggle }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="job-card hover-lift interactive"
    >
      <Link to={`/jobs/${job.id}`} className="job-card-link">
        <div className="job-card-header">
          <h3 className="gradient-text">{job.title}</h3>
          <div className="header-actions">
            <span className={`status-badge status-${job.status}`}>{job.status}</span>
            <div className="drag-handle" {...listeners}>
              <span>⋮⋮</span>
            </div>
          </div>
        </div>
        <div className="job-card-meta">
          <span className="job-id">ID: {job.id}</span>
        </div>
      </Link>
      
      <div className="job-card-actions">
        <div className="tooltip">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(job);
            }}
            className="edit-btn hover-scale"
            aria-label="Edit job"
          >
            ✏️
          </button>
          <span className="tooltip-content">Edit Job</span>
        </div>
        
        <div className="tooltip">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked, calling onStatusToggle with job:', job);
              onStatusToggle(job);
            }}
            className="btn-archive hover-scale"
            aria-label={job.status === 'active' ? 'Archive job' : 'Unarchive job'}
          >
            {job.status === 'active' ? 'Archive' : 'Unarchive'}
          </button>
          <span className="tooltip-content">
            {job.status === 'active' ? 'Archive this job' : 'Unarchive this job'}
          </span>
        </div>
      </div>
    </div>
  );
}

