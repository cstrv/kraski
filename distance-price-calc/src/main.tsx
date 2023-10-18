// src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('react-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}