import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AgentAuthProvider } from './components/auth/AgentAuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AgentAuthProvider>
      <App />
    </AgentAuthProvider>
  </React.StrictMode>,
);
