// Auto-scroll to next reel/video after current finishes, allow manual scroll
let autoScrollActive = false;
let videoElement = null;
let observer = null;

function findVideoElement() {
  // For Shorts, the video is inside .html5-video-player or .shorts-player-container
  let shortsVideo = document.querySelector('.shorts-player-container video, .html5-video-player video');
  if (shortsVideo) return shortsVideo;
  // Fallback to any video tag
  return document.querySelector('video');
}

function scrollToNextReel() {
  // For Shorts, try to find the next Shorts video in the DOM
  const shortsItems = document.querySelectorAll('ytd-reel-video-renderer, ytd-reel-item-renderer');
  let foundCurrent = false;
  for (let item of shortsItems) {
    if (foundCurrent) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (item.contains(videoElement)) {
      foundCurrent = true;
    }
  }
  // Fallback: scroll down by a large amount
  window.scrollBy({ top: window.innerHeight, left: 0, behavior: 'smooth' });
}

function onVideoEnded() {
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

function startAutoScroll() {
  videoElement = findVideoElement();
  if (videoElement) {
    videoElement.addEventListener('ended', onVideoEnded);
  }
  // Observe for video changes (e.g., when user scrolls manually)
  if (!observer) {
    observer = new MutationObserver(() => {
      let newVideo = findVideoElement();
      if (newVideo !== videoElement) {
        if (videoElement) videoElement.removeEventListener('ended', onVideoEnded);
        videoElement = newVideo;
        if (videoElement) videoElement.addEventListener('ended', onVideoEnded);
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
  if (document.getElementById('yt-auto-scroll-btn')) return;
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'yt-auto-scroll-btn';
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
  window.toggleBtn = toggleBtn;
}

function tryInjectButton() {
  injectToggleButton();
}

tryInjectButton();
document.addEventListener('yt-navigate-finish', tryInjectButton);
document.addEventListener('DOMContentLoaded', tryInjectButton);
