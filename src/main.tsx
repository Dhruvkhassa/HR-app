import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedDatabase } from './db/seed.ts';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// This function starts the mock service worker.
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  // Worker is already started in browser.ts, just import it
  await import('./mocks/browser.ts');
}

// Enable mocking, then seed the database, then render the app.
enableMocking().then(async () => {
  // Only seed database in development mode
  if (import.meta.env.MODE === 'development') {
    await seedDatabase();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
});