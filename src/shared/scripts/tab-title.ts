export {};

const originalTitle = document.title;
let restoreTimer: number | undefined;
let active = true;

const clearRestoreTimer = () => {
  window.clearTimeout(restoreTimer);
  restoreTimer = undefined;
};

const updateTitle = () => {
  if (!active) return;
  clearRestoreTimer();
  if (document.hidden) {
    document.title = '先睡一会儿…';
  } else {
    document.title = '欢迎回来';
    restoreTimer = window.setTimeout(() => {
      document.title = originalTitle;
      restoreTimer = undefined;
    }, 1600);
  }
};

document.addEventListener('visibilitychange', updateTitle);
window.addEventListener('pagehide', () => {
  active = false;
  clearRestoreTimer();
  document.title = originalTitle;
});
window.addEventListener('pageshow', () => {
  active = true;
  clearRestoreTimer();
  document.title = document.hidden ? '先睡一会儿…' : originalTitle;
});
if (document.hidden) updateTitle();
