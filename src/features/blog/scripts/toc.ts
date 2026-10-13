export {};
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc a'));
if ('IntersectionObserver' in window && links.length) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        const current = decodeURIComponent(link.hash.slice(1)) === entry.target.id;
        if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-100px 0px -55% 0px' });
  for (const link of links) {
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target) observer.observe(target);
  }
}
