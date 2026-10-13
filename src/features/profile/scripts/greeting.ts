import { getGreeting } from '../data/greeting';

const greeting = document.querySelector<HTMLElement>('[data-greeting]');
if (greeting) {
  const updateGreeting = () => {
    const text = getGreeting(new Date().getHours());
    if (greeting.textContent !== text) greeting.textContent = text;
  };
  updateGreeting();
  window.setInterval(updateGreeting, 60_000);
}
