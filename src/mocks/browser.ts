// src/mocks/browser.ts

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Start the worker immediately in development
if (import.meta.env.MODE === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}