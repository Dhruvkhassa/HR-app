// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedDatabase } from './db/seed.ts';

// This function starts the mock service worker.
async function enableMocking() {
  // Enable MSW in both development and production since this is a client-side app
  // that uses IndexedDB for data storage and doesn't have a backend API
  const { worker } = await import('./mocks/browser.ts');

  // `onunhandledrejection` is a good place to listen for errors from the worker.
  // It helps in debugging when a request is not handled by any of your handlers.
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// Enable mocking, then seed the database, then render the app.
enableMocking().then(async () => {
  await seedDatabase();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});