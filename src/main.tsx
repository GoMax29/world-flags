import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Register service worker with automatic update handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none', // Always fetch fresh SW file
      });
      
      console.log('[PWA] Service Worker registered');

      // Check for updates immediately and every 60 seconds
      registration.update();
      setInterval(() => registration.update(), 60000);

      // Handle new service worker waiting
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available - reload to get updates
              console.log('[PWA] New version available, reloading...');
              newWorker.postMessage('skipWaiting');
            }
          });
        }
      });

      // Listen for controller change (new SW activated) and reload
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('[PWA] New service worker activated, refreshing page...');
          window.location.reload();
        }
      });

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SW_UPDATED') {
          console.log(`[PWA] Updated to version: ${event.data.version}`);
        }
      });

    } catch (error) {
      console.log('[PWA] SW registration failed:', error);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
