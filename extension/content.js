// Auto-scroll to next reel/video after current finishes, allow manual scroll
let autoScrollActive = false;
let videoElement = null;
let observer = null;

function findVideoElement() {
  // Try to find Shorts/Reels video first
  let shortsVideo = document.querySelector('video[src*="googlevideo"]');
  if (shortsVideo) return shortsVideo;
  // Fallback to any video tag
  return document.querySelector('video');
}

function scrollToNextReel() {
  // For YouTube Shorts, next reel is usually in the next ytd-reel-video-renderer
  let currentReel = document.querySelector('ytd-reel-video-renderer[is-active]');
  if (currentReel) {
    let nextReel = currentReel.nextElementSibling;
    if (nextReel) {
      nextReel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }
  // For regular videos, scroll down by a large amount
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
