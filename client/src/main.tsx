import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error("root wasn't found at index.html");
const root = createRoot(rootEl);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
