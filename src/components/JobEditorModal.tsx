import { useEffect } from 'react';
import { useForm,type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Job } from '../db/db';
import { useToast } from '../hooks/useToast';
import './JobEditorModal.css';

const jobSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  tags: z.string().min(1, { message: 'At least one tag is required' }),
});

type JobFormInputs = z.infer<typeof jobSchema>;

interface JobEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
  jobToEdit: Job | null;
}

export function JobEditorModal({ isOpen, onClose, onJobCreated: onSave, jobToEdit }: JobEditorModalProps) {
  const isEditMode = jobToEdit !== null;
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobFormInputs>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (isOpen && isEditMode) {
      reset({
        title: jobToEdit.title,
        tags: jobToEdit.tags.join(', '),
      });
    } else if (isOpen && !isEditMode) {
      reset({
        title: '',
        tags: '',
      });
    }
  }, [isOpen, isEditMode, jobToEdit, reset]);

  const onSubmit: SubmitHandler<JobFormInputs> = async (data) => {
    try {
      const url = isEditMode ? `/jobs/${jobToEdit.id}` : '/jobs';
      const method = isEditMode ? 'PATCH' : 'POST';

      const jobPayload = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        tags: data.tags.split(',').map((tag) => tag.trim()),
      };

      // In create mode, we add the default status and order
      const finalPayload = isEditMode
        ? jobPayload
        : { ...jobPayload, status: 'active' as const, order: new Date().getTime() };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      success(
        `Job ${isEditMode ? 'updated' : 'created'} successfully`,
        `${isEditMode ? 'Job has been updated' : 'New job has been created'} and is now available`
      );

      reset();
      onSave();
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      error(
        `Failed to ${isEditMode ? 'update' : 'create'} job`,
        'There was an error saving the job. Please try again.'
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Job' : 'Create New Job'}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
            <label htmlFor="title">Job Title</label>
            <input 
              id="title" 
              {...register('title')} 
              placeholder="Enter job title (e.g., Senior React Developer)"
              autoComplete="off"
            />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>
          <div className={`form-group ${errors.tags ? 'has-error' : ''}`}>
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input 
              id="tags" 
              {...register('tags')} 
              placeholder="Enter tags separated by commas (e.g., Full-time, Remote, Engineering)"
              autoComplete="off"
            />
            {errors.tags && <p className="error-message">{errors.tags.message}</p>}
            <p className="form-hint">
              💡 Tags help categorize and filter jobs (e.g., Full-time, Remote, Engineering, Marketing)
            </p>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              <span>Cancel</span>
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{isEditMode ? '💾' : '➕'}</span>
                  <span>{isEditMode ? 'Save Changes' : 'Create Job'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}