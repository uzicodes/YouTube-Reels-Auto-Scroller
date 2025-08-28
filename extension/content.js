// Auto-scroll YouTube video page with toggle button and video end detection
let autoScrollActive = false;
let scrollInterval = null;
let videoElement = null;

function findVideoElement() {
  // YouTube uses 'video' tag for the player
  return document.querySelector('video');
}

function autoScroll() {
  // Only scroll if video is playing and not ended
  if (videoElement && !videoElement.ended && !videoElement.paused) {
    window.scrollBy({ top: 100, left: 0, behavior: 'smooth' });
  }
  // Stop auto-scroll if video ended
  if (videoElement && videoElement.ended) {
    stopAutoScroll();
    toggleBtn.textContent = 'Start Auto-Scroll';
    autoScrollActive = false;
  }
}

function startAutoScroll() {
  if (!scrollInterval) {
    videoElement = findVideoElement();
    if (videoElement) {
      scrollInterval = setInterval(autoScroll, 2000);
    }
  }
}

function stopAutoScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
}

function toggleAutoScroll() {
  autoScrollActive = !autoScrollActive;
  if (autoScrollActive) {
    startAutoScroll();
    toggleBtn.textContent = 'Stop Auto-Scroll';
  } else {
    stopAutoScroll();
    toggleBtn.textContent = 'Start Auto-Scroll';
  }
}

// Create toggle button
const toggleBtn = document.createElement('button');
toggleBtn.textContent = 'Start Auto-Scroll';
toggleBtn.style.position = 'fixed';
toggleBtn.style.top = '20px';
toggleBtn.style.right = '20px';
toggleBtn.style.zIndex = '9999';
toggleBtn.style.padding = '10px 20px';
toggleBtn.style.background = '#ff0000';
toggleBtn.style.color = '#fff';
toggleBtn.style.border = 'none';
toggleBtn.style.borderRadius = '5px';
toggleBtn.style.cursor = 'pointer';
toggleBtn.style.fontSize = '16px';
toggleBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
toggleBtn.addEventListener('click', toggleAutoScroll);
document.body.appendChild(toggleBtn);
