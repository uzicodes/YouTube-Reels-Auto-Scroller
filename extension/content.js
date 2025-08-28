// YouTube Shorts Auto Scroller
let autoScrollActive = false;
let videoElement = null;

function findShortsVideo() {
  return document.querySelector('video');
}

function scrollToNextShort() {
  const shortsItems = document.querySelectorAll('ytd-reel-video-renderer, ytd-reel-item-renderer');
  let foundCurrent = false;
  for (let item of shortsItems) {
    if (foundCurrent) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('[AutoScroll] Scrolled to next Shorts item');
      return;
    }
    if (item.contains(videoElement)) {
      foundCurrent = true;
    }
  }
  window.scrollBy({ top: window.innerHeight, left: 0, behavior: 'smooth' });
  console.log('[AutoScroll] Fallback scroll down');
}

function onVideoEnded() {
  if (autoScrollActive) {
    scrollToNextShort();
    setTimeout(() => {
      videoElement = findShortsVideo();
      if (videoElement) {
        videoElement.removeEventListener('ended', onVideoEnded);
        videoElement.addEventListener('ended', onVideoEnded);
      }
    }, 2000);
  }
}

function startAutoScroll() {
  videoElement = findShortsVideo();
  if (videoElement) {
    videoElement.removeEventListener('ended', onVideoEnded);
    videoElement.addEventListener('ended', onVideoEnded);
    console.log('[AutoScroll] Started auto-scroll');
  } else {
    console.log('[AutoScroll] No Shorts video found');
  }
}

function stopAutoScroll() {
  if (videoElement) {
    videoElement.removeEventListener('ended', onVideoEnded);
  }
  console.log('[AutoScroll] Stopped auto-scroll');
}

function toggleAutoScroll() {
  autoScrollActive = !autoScrollActive;
  if (autoScrollActive) {
    startAutoScroll();
    window.toggleBtn.textContent = 'Stop Auto-Scroll';
    window.toggleBtn.style.background = '#008000';
  } else {
    stopAutoScroll();
    window.toggleBtn.textContent = 'Start Auto-Scroll';
    window.toggleBtn.style.background = '#ff0000';
  }
}

function injectToggleButton() {
  let toggleBtn = document.getElementById('yt-auto-scroll-btn');
  if (toggleBtn) {
    toggleBtn.onclick = toggleAutoScroll;
    window.toggleBtn = toggleBtn;
    return;
  }
  toggleBtn = document.createElement('button');
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
  toggleBtn.onclick = toggleAutoScroll;
  document.body.appendChild(toggleBtn);
  window.toggleBtn = toggleBtn;
}

function setup() {
  injectToggleButton();
  console.log('[AutoScroll] Content script loaded');
}

setup();
document.addEventListener('yt-navigate-finish', setup);
document.addEventListener('DOMContentLoaded', setup);