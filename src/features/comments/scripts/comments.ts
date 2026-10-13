import type { WalineInstance } from '@waline/client';

const root = document.querySelector<HTMLElement>('[data-comments]');
if (root) {
  const status = root.querySelector<HTMLElement>('[data-comment-status]')!;
  const retry = root.querySelector<HTMLButtonElement>('[data-comment-retry]')!;
  const mount = root.querySelector<HTMLElement>('[data-waline]')!;
  const serverURL = root.dataset.serverUrl!;
  const path = root.dataset.path!;
  let instance: WalineInstance | null = null;
  let controller: AbortController | undefined;
  let busy = false;
  let destroyed = false;
  const load = async () => {
    if (busy || destroyed) return;
    busy = true; retry.hidden = true; status.hidden = false;
    status.textContent = '正在加载评论…';
    controller = new AbortController();
    const timeout = setTimeout(() => controller?.abort(), 10000);
    try {
      const [{ init }, { getComment }] = await Promise.all([import('@waline/client'), import('@waline/api'), import('@waline/client/style')]);
      const preview = await getComment({ serverURL, lang: 'zh-CN', path, page: 1, pageSize: 10, sortBy: 'insertedAt_desc', signal: controller.signal });
      if (!preview || !Array.isArray(preview.data)) throw new Error('Invalid comment response');
      if (destroyed) return;
      instance?.destroy();
      instance = init({ el: mount, serverURL, path, lang: 'zh-CN', dark: 'html[data-theme="dark"]', pageview: false, comment: false, emoji: false, imageUploader: false, search: false, texRenderer: false, highlighter: false });
      if (!instance) throw new Error('Waline failed to mount');
      status.hidden = true;
    } catch {
      if (!destroyed) { status.textContent = '评论暂时无法加载，请稍后重试。'; retry.hidden = false; }
    } finally { clearTimeout(timeout); busy = false; }
  };
  retry.addEventListener('click', () => { void load(); });
  let observer: IntersectionObserver | undefined;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { observer?.disconnect(); void load(); }
    }, { rootMargin: '300px' });
    observer.observe(root);
  } else void load();
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    destroyed = true; observer?.disconnect(); controller?.abort(); instance?.destroy();
  });
}
