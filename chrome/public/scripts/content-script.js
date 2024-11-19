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
  
  const videoContainers = document.querySelectorAll('.ytd-rich-item-renderer');

  videoContainers.forEach(container => {
      
      const existingCustomElement = container.querySelector('.custom-video-overlay');
      if (existingCustomElement) {
          existingCustomElement.remove();
      }

      
      const customElement = createCustomElement();
      container.style.position = 'relative';  
      container.appendChild(customElement);
  });
}

function observeDynamicContent() {
  const targetNode = document.querySelector('body'); 
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
              injectIntoVideos();
          }
      });
  });
  if (targetNode) {
      observer.observe(targetNode, config);
  }
}
injectIntoVideos();
observeDynamicContent();

