export {};

const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#site-nav');

if (toggle && navigation) {
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.removeAttribute('data-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.toggleAttribute('data-open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) close();
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', close);
}
