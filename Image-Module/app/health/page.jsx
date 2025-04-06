'use client';

import React, { useState, useEffect } from 'react';

export default function Health() {
  const [backgroundData, setBackgroundData] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItemExpansion = (index) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  const renderStatusIcon = (item) => {
    if (item.status === 'healthy') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    );
  };

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);

          // Listen for messages from the service worker
          const messageHandler = (event) => {
            if (event.data && event.data.type === 'BACKGROUND_FETCH') {
              // Update state with new data
              setBackgroundData(prevData => {
                // Optionally limit the number of stored items
                return [event.data.data, ...prevData].slice(0, 10);
              });
            }
          };

          navigator.serviceWorker.addEventListener('message', messageHandler);

          // Optional: Send a message to start background fetching
          registration.active?.postMessage({
            type: 'START_BACKGROUND_FETCH'
          });

          // Cleanup function
          return () => {
            navigator.serviceWorker.removeEventListener('message', messageHandler);
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  if (backgroundData.length === 0) {
    return (
      <div className="flex items-center justify-center space-x-2 text-gray-600 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        <p>Waiting for background data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <h1 className="text-2xl font-bold text-white">Background Fetch Data</h1>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">Latest Fetched Data</span>
            {renderStatusIcon(backgroundData[0])}
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
              {JSON.stringify(backgroundData[0], null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
          <h3 className="text-xl font-semibold text-white">Data History</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {backgroundData.map((item, index) => (
            <div 
              key={index} 
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleItemExpansion(index)}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">
                    Item {index + 1}
                  </span>
                  {renderStatusIcon(item)}
                </div>
                <span className="text-gray-500 text-sm">
                  {expandedItems.has(index) ? 'Collapse' : 'Expand'}
                </span>
              </div>
              
              {expandedItems.has(index) && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}