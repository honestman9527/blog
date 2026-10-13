import { afterEach, beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 13, 10, 59, 59));
  vi.stubGlobal('window', globalThis);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('replaces the static fallback using the visitor clock and updates across time periods', async () => {
  const greeting = { textContent: '你好，欢迎来坐坐。' };
  vi.stubGlobal('document', { querySelector: () => greeting });
  await import('./greeting');
  expect(greeting.textContent).toBe('早上好，欢迎来坐坐。');

  vi.advanceTimersByTime(60_000);
  expect(greeting.textContent).toBe('中午好，欢迎来坐坐。');
});

it('does not start a timer when the greeting element is absent', async () => {
  vi.stubGlobal('document', { querySelector: () => null });
  await import('./greeting');
  expect(vi.getTimerCount()).toBe(0);
});
