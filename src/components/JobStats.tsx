import { type Job } from '../db/db';

interface JobStatsProps {
  jobs: Job[];
}

export function JobStats({ jobs }: JobStatsProps) {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const archivedJobs = jobs.filter(job => job.status === 'archived').length;
  
  // Calculate tag distribution
  const tagCounts = jobs.reduce((acc, job) => {
    if (job.tags && Array.isArray(job.tags)) {
      job.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const activePercentage = totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0;

  return (
    <div className="job-stats-enhanced">
      <div className="stats-grid">
        {/* Main Stats Cards */}
        <div className="stat-card stat-card-primary animate-slide-in-up">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-trend">
            <span className="trend-icon">📈</span>
            <span className="trend-text">+12% this month</span>
          </div>
        </div>

        <div className="stat-card stat-card-success animate-slide-in-up animate-delay-100">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{activeJobs}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${activePercentage}%` }}
            />
          </div>
        </div>

        <div className="stat-card stat-card-warning animate-slide-in-up animate-delay-200">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-number">{archivedJobs}</div>
            <div className="stat-label">Archived Jobs</div>
          </div>
          <div className="stat-percentage">
            {Math.round((archivedJobs / totalJobs) * 100)}% of total
          </div>
        </div>

        {/* Tag Distribution */}
        <div className="stat-card stat-card-info animate-slide-in-up animate-delay-300">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-label">Top Tags</div>
            <div className="tag-distribution">
              {topTags.map(([tag, count], index) => (
                <div key={tag} className="tag-item">
                  <span className="tag-name">{tag}</span>
                  <div className="tag-bar">
                    <div 
                      className="tag-fill"
                      style={{ 
                        width: `${(count / topTags[0][1]) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  </div>
                  <span className="tag-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
