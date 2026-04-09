import React from 'react';
import { createRoot } from 'react-dom/client';
import CookieBanner from './CookieBanner';

const initCMP = () => {
  let container = document.getElementById('mon-cmp-root');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'mon-cmp-root';
    document.body.appendChild(container);
  }

  const root = createRoot(container);
  root.render(<CookieBanner />);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCMP);
} else {
  initCMP();
}
