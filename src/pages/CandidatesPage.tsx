import { useState, useEffect } from 'react';
import { type Candidate } from '../db/db';
import { Link } from 'react-router-dom';
import './CandidatesPage.css';

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true);
      const params = new URLSearchParams();
      if (stageFilter !== 'all') {
        params.append('stage', stageFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      const query = params.toString();
      const url = query ? `/api/candidates?${query}` : '/api/candidates';
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch candidates');
        const data = await response.json();
        setCandidates(data.data || []);
        setPagination(data.pagination || { total: 0, totalPages: 0, hasNext: false, hasPrev: false });
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setCandidates([]);
        setPagination({ total: 0, totalPages: 0, hasNext: false, hasPrev: false });
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, [stageFilter, searchTerm, currentPage, pageSize]);

  return (
    <div className="candidates-page">
      <nav className="page-nav">
        <Link to="/jobs" className="nav-link">&larr; Back to Jobs Board</Link>
        <Link to="/candidates/board" className="nav-link">Board View &rarr;</Link>
      </nav>
      <h1>Candidates</h1>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Stages</option>
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p>Displaying {candidates.length} of {pagination.total} candidates.</p>
      <div className="candidates-list-container">
        {loading ? (
          <div className="loading-overlay">Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <p>No candidates found.</p>
          </div>
        ) : (
          <div className="candidates-list">
            {candidates.map((candidate) => (
              <Link to={`/candidates/${candidate.id}`} key={candidate.id} className="list-item-link">
                <div className="list-item">
                  <div className="candidate-info">
                    <div className="item-name">{candidate.name}</div>
                    <div className="item-email">{candidate.email}</div>
                  </div>
                  <div className={`item-stage stage-${candidate.stage}`}>
                    {candidate.stage}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} candidates
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
    </div>
  );
}