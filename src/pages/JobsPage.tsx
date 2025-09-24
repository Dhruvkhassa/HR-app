import { useEffect, useState, useCallback } from 'react';
import { DndContext, closestCenter,type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { type Job } from '../db/db';
import { JobsList } from '../components/JobsList';
import { JobEditorModal } from '../components/JobEditorModal';
import { ToastContainer } from '../components/Toast';
import { ThemeToggle } from '../components/ThemeToggle';
import { JobStats } from '../components/JobStats';
import { useToast } from '../hooks/useToast';
import { SkeletonCard } from '../components/Skeleton';
import './JobsPage.css';
import { Link } from 'react-router-dom';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const { toasts, success, error, removeToast } = useToast();

  const fetchJobs = useCallback(async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    params.append('page', currentPage.toString());
    params.append('pageSize', pageSize.toString());
    const query = params.toString();
    const url = query ? `/jobs?${query}` : '/jobs';
    try {
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenEditModal = (job: Job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setJobToEdit(null);
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (job: Job) => {
    console.log('handleStatusToggle called with job:', job);
    
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    console.log('New status will be:', newStatus);
    
    try {
      console.log('Making PATCH request to:', `/jobs/${job.id}`);
      const response = await fetch(`/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error('Failed to update status');
      
      console.log('Success! Showing toast...');
      success(
        `Job ${newStatus === 'active' ? 'activated' : 'archived'}`,
        `${job.title} has been ${newStatus === 'active' ? 'activated' : 'archived'} successfully`
      );
      
      console.log('Refreshing jobs...');
      fetchJobs();
    } catch (err) {
      console.error('Error updating status:', err);
      error(
        'Failed to update job status',
        'There was an error updating the job status. Please try again.'
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const originalJobs = [...jobs];
      setJobs((currentJobs) => {
        const oldIndex = currentJobs.findIndex((j) => j.id === active.id);
        const newIndex = currentJobs.findIndex((j) => j.id === over.id);
        return arrayMove(currentJobs, oldIndex, newIndex);
      });
      try {
        const response = await fetch(`/jobs/${active.id}/reorder`, {
          method: 'PATCH',
        });
        if (!response.ok) {
          throw new Error('Failed to reorder job on the server');
        }
        success('Jobs reordered', 'Job order has been updated successfully');
      } catch (error) {
        console.error('Reorder failed, rolling back.', error);
        setJobs(originalJobs);
        error('Failed to reorder jobs', 'There was an error reordering jobs. Please try again.');
      }
    }
  };

  return (
    <div className="jobs-page">
      {/* Modern Header with Gradient Background */}
      <header className="jobs-page-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">🚀</div>
              <h1>Jobs Board</h1>
            </div>
            <p className="header-subtitle">Manage your job postings and track applications</p>
          </div>
          <nav className="header-nav">
            <Link to="/candidates" className="nav-link">
              <span className="nav-icon">👥</span>
              Candidates
            </Link>
            <ThemeToggle />
            <button onClick={handleOpenCreateModal} className="create-job-btn">
              <span className="btn-icon">+</span>
              Create Job
            </button>
          </nav>
        </div>
      </header>

      {/* Simplified Filter Section */}
      <div className="filter-section">
        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Jobs</option>
            <option value="archived">Archived Jobs</option>
          </select>
        </div>

        <JobStats jobs={jobs} />
      </div>

      {/* Section Divider */}
      <div className="section-divider">
        <div className="divider-line"></div>
        <div className="divider-content">
          <span className="divider-text">Job Listings</span>
        </div>
        <div className="divider-line"></div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {loading ? (
            <div className="loading-container">
              <div className="skeleton-grid">
                {Array.from({ length: 6 }, (_, index) => (
                  <SkeletonCard key={index} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }} />
                ))}
              </div>
            </div>
          ) : (
            <JobsList
              jobs={jobs}
              onEdit={handleOpenEditModal}
              onStatusToggle={handleStatusToggle}
            />
          )}
        </DndContext>
      </div>

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} jobs
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="pagination-btn"
            >
              Previous
            </button>
            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-page ${pageNum === currentPage ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <JobEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onJobCreated={fetchJobs}
          jobToEdit={jobToEdit}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}