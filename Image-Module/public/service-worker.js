// public/service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Background data fetching
async function fetchDataInBackground() {
  try {
    const response = await fetch(`/api/ready`);
    const data = await response.json();
    
    // Broadcast the data to all clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_FETCH',
        data: data
      });
    });
  } catch (error) {
    console.error('Background fetch error:', error);
  }
}

// Periodic background fetch
setInterval(() => {
  fetchDataInBackground();
}, 10 * 20 * 1000); // 10 minutes

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_BACKGROUND_FETCH') {
    fetchDataInBackground();
  }
});
