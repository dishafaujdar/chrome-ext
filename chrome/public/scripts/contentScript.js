// Function to create and style the custom element
function createCustomElement() {
  const customElement = document.createElement('div');
  customElement.className = 'custom-video-overlay';
  customElement.style.cssText = `
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      font-size: 18px;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
  `;
  customElement.innerText = 'This is a custom overlay!';
  return customElement;
}
function injectIntoVideos() {
  // Select all video containers on the YouTube page
  const videoContainers = document.querySelectorAll('.ytd-rich-item-renderer');

  videoContainers.forEach(container => {
      // Remove any existing custom elements to avoid duplicates
      const existingCustomElement = container.querySelector('.custom-video-overlay');
      if (existingCustomElement) {
          existingCustomElement.remove();
      }

      // Append the custom element to each video container
      const customElement = createCustomElement();
      container.style.position = 'relative';  // Ensure the container is positioned
      container.appendChild(customElement);
  });
}
// Function to initialize the observer
function observeDynamicContent() {
  const targetNode = document.querySelector('body'); // The body or main container element
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          // Re-inject custom elements when new video containers are added
          if (mutation.addedNodes.length) {
              injectIntoVideos();
          }
      });
  });

  // Start observing the target node
  if (targetNode) {
      observer.observe(targetNode, config);
  }
}

// Initialize the injection and observer
injectIntoVideos();
observeDynamicContent();

