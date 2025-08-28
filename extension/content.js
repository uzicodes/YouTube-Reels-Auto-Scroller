// Auto-scroll to next reel/video after current finishes, allow manual scroll
let autoScrollActive = false;
let videoElement = null;
let observer = null;

function findVideoElement() {
  // For Shorts, the video is inside .html5-video-player or .shorts-player-container
  let shortsVideo = document.querySelector('.shorts-player-container video, .html5-video-player video');
  if (shortsVideo) {
    console.log('[AutoScroll] Shorts video detected:', shortsVideo);
    return shortsVideo;
  }
  // Fallback to any video tag
  let fallbackVideo = document.querySelector('video');
  if (fallbackVideo) {
    console.log('[AutoScroll] Fallback video detected:', fallbackVideo);
  }
  return fallbackVideo;
// ...existing code...

function scrollToNextReel() {
  // For Shorts, try to find the next Shorts video in the DOM
  const shortsItems = document.querySelectorAll('ytd-reel-video-renderer, ytd-reel-item-renderer');
  let foundCurrent = false;
  for (let item of shortsItems) {
    if (foundCurrent) {
      console.log('[AutoScroll] Scrolling to next Shorts item:', item);
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (item.contains(videoElement)) {
      foundCurrent = true;
    }
  }
  // Fallback: scroll down by a large amount
  console.log('[AutoScroll] Fallback scroll down');
  window.scrollBy({ top: window.innerHeight, left: 0, behavior: 'smooth' });
}

function onVideoEnded() {
  console.log('[AutoScroll] Video ended event fired');
  if (autoScrollActive) {
    scrollToNextReel();
    setTimeout(() => {
      videoElement = findVideoElement();
      if (videoElement) {
        videoElement.removeEventListener('ended', onVideoEnded);
        videoElement.addEventListener('ended', onVideoEnded);
      }
    }, 2000);
  }
}

  videoElement = findVideoElement();
  if (videoElement) {
    console.log('[AutoScroll] Adding ended event listener to video:', videoElement);
    videoElement.addEventListener('ended', onVideoEnded);
  } else {
    console.log('[AutoScroll] No video element found to add ended event listener');
  }
  // Observe for video changes (e.g., when user scrolls manually)
  if (!observer) {
    observer = new MutationObserver(() => {
      let newVideo = findVideoElement();
      if (newVideo !== videoElement) {
        if (videoElement) videoElement.removeEventListener('ended', onVideoEnded);
        videoElement = newVideo;
        if (videoElement) {
          console.log('[AutoScroll] Video changed, adding ended event listener:', videoElement);
          videoElement.addEventListener('ended', onVideoEnded);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function stopAutoScroll() {
  if (videoElement) {
    videoElement.removeEventListener('ended', onVideoEnded);
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function toggleAutoScroll() {
  autoScrollActive = !autoScrollActive;
  if (autoScrollActive) {
    startAutoScroll();
    window.toggleBtn.textContent = 'Stop Auto-Scroll';
  } else {
    stopAutoScroll();
    window.toggleBtn.textContent = 'Start Auto-Scroll';
  }
}

function injectToggleButton() {
  if (document.getElementById('yt-auto-scroll-btn')) {
    console.log('[AutoScroll] Toggle button already exists');
    return;
  }
  console.log('[AutoScroll] Injecting toggle button');
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'yt-auto-scroll-btn';
  toggleBtn.textContent = 'Start Auto-Scroll';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '20px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.zIndex = '2147483647';
  toggleBtn.style.pointerEvents = 'auto';
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
  window.toggleBtn = toggleBtn;
}

function tryInjectButton() {
  injectToggleButton();
}

console.log('[AutoScroll] Content script loaded');

// Add a visible test element to confirm script execution
const testDiv = document.createElement('div');
testDiv.textContent = '[AutoScroll] Script is running';
testDiv.style.position = 'fixed';
testDiv.style.bottom = '10px';
testDiv.style.left = '10px';
testDiv.style.background = '#222';
testDiv.style.color = '#fff';
testDiv.style.padding = '4px 8px';
testDiv.style.zIndex = '99999';
testDiv.style.fontSize = '12px';
document.body.appendChild(testDiv);

setTimeout(tryInjectButton, 1000);
document.addEventListener('yt-navigate-finish', () => setTimeout(tryInjectButton, 1000));
document.addEventListener('DOMContentLoaded', () => setTimeout(tryInjectButton, 1000));
