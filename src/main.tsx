import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'sonner/dist/styles.css';
import './index.css';
import App from './App.tsx';
import { validateEnvironment } from './lib/validateEnv';

// Validate environment variables before starting the app
validateEnvironment();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
