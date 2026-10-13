export {};

document.querySelectorAll<HTMLElement>('[data-prose] pre').forEach((block) => {
  const code = block.querySelector('code');
  if (!code || block.querySelector('button')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code';
  button.textContent = '复制代码';
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.setAttribute('role', 'status');
  status.setAttribute('data-pagefind-ignore', '');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      status.textContent = '代码已复制';
      window.setTimeout(() => {
        status.textContent = '';
      }, 2500);
    } catch {
      status.textContent = '复制失败，请选择代码后手动复制。';
    }
  });
  block.append(button);
  block.after(status);
});
