export {};
type Pagefind = typeof import('*/pagefind/pagefind.js');
type Result = Awaited<ReturnType<Pagefind['search']>>['results'][number];
const pagefindModuleUrl = '/pagefind/pagefind.js';

const root = import.meta.env.DEV ? null : document.querySelector<HTMLElement>('[data-search]');
if (root) {
  const form = root.querySelector<HTMLFormElement>('form')!;
  const input = root.querySelector<HTMLInputElement>('input')!;
  const status = root.querySelector<HTMLElement>('[role="status"]')!;
  const list = root.querySelector<HTMLOListElement>('[data-search-results]')!;
  const retry = root.querySelector<HTMLButtonElement>('[data-search-retry]')!;
  const more = root.querySelector<HTMLButtonElement>('[data-search-more]')!;
  let revision = 0;
  let timer: ReturnType<typeof setTimeout>;
  let matches: Result[] = [];
  let shown = 0;

  // Only preserve Pagefind's mark elements; no HTML from metadata enters the DOM.
  const excerpt = (html: string) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    const output = document.createDocumentFragment();
    const copy = (node: Node, parent: Node) => {
      if (node.nodeType === Node.TEXT_NODE)
        parent.appendChild(document.createTextNode(node.textContent ?? ''));
      else if (node instanceof Element && node.tagName === 'MARK') {
        const mark = document.createElement('mark');
        mark.textContent = node.textContent;
        parent.appendChild(mark);
      } else node.childNodes.forEach((child) => copy(child, parent));
    };
    template.content.childNodes.forEach((node) => copy(node, output));
    return output;
  };

  const appendBatch = async (ticket: number) => {
    more.disabled = true;
    const end = Math.min(shown + 20, matches.length);
    const results = await Promise.all(matches.slice(shown, end).map((result) => result.data()));
    if (ticket !== revision) return;
    for (const result of results) {
      const item = document.createElement('li');
      const type = document.createElement('span');
      type.className = 'search-result-type';
      type.textContent = result.meta.type ?? '内容';
      const heading = document.createElement('h2');
      const link = document.createElement('a');
      const url = new URL(result.url, location.origin);
      if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) continue;
      link.href = url.pathname + url.search + url.hash;
      link.textContent = result.meta.title ?? '查看内容';
      heading.append(link);
      const summary = document.createElement('p');
      summary.append(excerpt(result.excerpt));
      item.append(type, heading, summary);
      list.append(item);
    }
    shown = end;
    status.textContent = matches.length
      ? `找到 ${matches.length} 条结果${shown < matches.length ? `，已展示 ${shown} 条` : ''}`
      : '没有找到相关内容，试试更短的关键词。';
    more.hidden = shown >= matches.length;
    more.disabled = false;
  };

  const fail = () => {
    status.textContent = '搜索暂时无法加载，请重试。';
    retry.hidden = false;
    more.hidden = true;
  };

  const search = async () => {
    clearTimeout(timer);
    const ticket = ++revision;
    const query = input.value.trim().slice(0, 200);
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    list.replaceChildren();
    retry.hidden = true;
    more.hidden = true;
    shown = 0;
    matches = [];
    if (!query) {
      status.textContent = '';
      return;
    }
    status.textContent = '正在搜索…';
    try {
      // eslint-disable-next-line no-restricted-syntax -- Fixed generated asset URL, not a source-module dependency.
      const pagefind: Pagefind = await import(/* @vite-ignore */ pagefindModuleUrl);
      const response = await pagefind.search(query);
      if (ticket !== revision) return;
      matches = response.results;
      await appendBatch(ticket);
    } catch {
      if (ticket === revision) fail();
    }
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void search();
  });
  input.addEventListener('input', () => {
    ++revision;
    clearTimeout(timer);
    timer = setTimeout(() => {
      void search();
    }, 180);
  });
  more.addEventListener('click', () => {
    void appendBatch(revision).catch(fail);
  });
  retry.addEventListener('click', () => {
    location.reload();
  });
  input.value = (new URL(location.href).searchParams.get('q') ?? '').slice(0, 200);
  if (input.value) void search();
  window.addEventListener('popstate', () => {
    input.value = (new URL(location.href).searchParams.get('q') ?? '').slice(0, 200);
    void search();
  });
}
