// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetch_videos') {
      const filters = message.filters;
      
      fetch('http://localhost:3000/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => {
        console.error('Error fetching videos:', error);
        sendResponse({ success: false, error: error.toString() });
      });
  
      return true;
    }
  });
  