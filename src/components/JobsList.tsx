import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type Job } from '../db/db';
import { JobCard } from './JobCard';
import './JobsList.css';

interface JobsListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onStatusToggle: (job: Job) => void;
}

export function JobsList({ jobs, onEdit, onStatusToggle }: JobsListProps) {
  // Ensure we only pass items with valid IDs to the context
  const jobIds = jobs.map(j => j.id).filter(id => id !== undefined) as number[];

  return (
    <div className="jobs-list">
      <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="animate-slide-in-up hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <JobCard
              job={job}
              onEdit={onEdit}
              onStatusToggle={onStatusToggle}
            />
          </div>
        ))}
      </SortableContext>
    </div>
  );
}