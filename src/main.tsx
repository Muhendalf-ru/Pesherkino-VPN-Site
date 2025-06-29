import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://6070ba25dd0d563efd4f6d4f12dee094@o4509441212153856.ingest.de.sentry.io/4509584034955344',
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './cursor';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
