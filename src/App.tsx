import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { CandidatesBoardPage } from './pages/CandidatesBoardPage';
import { AssessmentBuilderPage } from './pages/AssessmentBuilderPage';
import { AssessmentTakePage } from './pages/AssessmentTakePage';

// Define all the application's routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <JobsPage />,
  },
  {
    path: '/jobs',
    element: <JobsPage />,
  },
  {
    path: '/jobs/:jobId',
    element: <JobDetailPage />,
  },
  {
    path: '/jobs/:jobId/assessment',
    element: <AssessmentBuilderPage />,
  },
  {
    path: '/jobs/:jobId/apply', // Candidate-facing assessment form
    element: <AssessmentTakePage />,
  },
  {
    path: '/candidates',
    element: <CandidatesPage />,
  },
  {
    path: '/candidates/:id',
    element: <CandidateDetailPage />,
  },
  {
    path: '/candidates/board',
    element: <CandidatesBoardPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
