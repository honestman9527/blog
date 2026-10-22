import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const originalTitle = '文章 / 爱睡觉的老实人的门面';
let documentTarget: EventTarget & { title: string; hidden: boolean };
let windowTarget: EventTarget;

const visibility = (hidden: boolean) => {
  documentTarget.hidden = hidden;
  documentTarget.dispatchEvent(new Event('visibilitychange'));
};

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  documentTarget = Object.assign(new EventTarget(), { title: originalTitle, hidden: false });
  windowTarget = new EventTarget();
  vi.stubGlobal('document', documentTarget);
  vi.stubGlobal('window', Object.assign(windowTarget, { setTimeout, clearTimeout }));
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('preserves the initial page title without a welcome message or idle timer', async () => {
  await import('./tab-title');
  windowTarget.dispatchEvent(new Event('pageshow'));
  expect(documentTarget.title).toBe(originalTitle);
  expect(vi.getTimerCount()).toBe(0);
});

it('changes the title when hidden, welcomes on return and restores the page-specific title', async () => {
  await import('./tab-title');
  visibility(true);
  expect(documentTarget.title).toBe('先睡一会儿…');
  visibility(false);
  expect(documentTarget.title).toBe('欢迎回来');
  vi.advanceTimersByTime(1599);
  expect(documentTarget.title).toBe('欢迎回来');
  vi.advanceTimersByTime(1);
  expect(documentTarget.title).toBe(originalTitle);
});

it('cancels stale restoration timers when rapidly switching tabs', async () => {
  await import('./tab-title');
  visibility(true);
  visibility(false);
  vi.advanceTimersByTime(800);
  visibility(true);
  expect(vi.getTimerCount()).toBe(0);
  vi.advanceTimersByTime(1000);
  expect(documentTarget.title).toBe('先睡一会儿…');
  visibility(false);
  vi.advanceTimersByTime(1600);
  expect(documentTarget.title).toBe(originalTitle);
});

it('handles a page initially opened in the background', async () => {
  documentTarget.hidden = true;
  await import('./tab-title');
  expect(documentTarget.title).toBe('先睡一会儿…');
  visibility(false);
  vi.advanceTimersByTime(1600);
  expect(documentTarget.title).toBe(originalTitle);
});

it('restores the title and cancels pending work before navigating away', async () => {
  await import('./tab-title');
  visibility(true);
  visibility(false);
  windowTarget.dispatchEvent(new Event('pagehide'));
  expect(documentTarget.title).toBe(originalTitle);
  expect(vi.getTimerCount()).toBe(0);
  visibility(true);
  expect(documentTarget.title).toBe(originalTitle);
});

it('resumes correctly after back/forward cache restoration', async () => {
  await import('./tab-title');
  visibility(true);
  windowTarget.dispatchEvent(new Event('pagehide'));
  documentTarget.hidden = false;
  windowTarget.dispatchEvent(new Event('pageshow'));
  expect(documentTarget.title).toBe(originalTitle);
  visibility(true);
  expect(documentTarget.title).toBe('先睡一会儿…');
  visibility(false);
  vi.advanceTimersByTime(1600);
  expect(documentTarget.title).toBe(originalTitle);
});

it('restores a background back/forward cache page without scheduling a welcome timer', async () => {
  await import('./tab-title');
  windowTarget.dispatchEvent(new Event('pagehide'));
  documentTarget.hidden = true;
  windowTarget.dispatchEvent(new Event('pageshow'));
  expect(documentTarget.title).toBe('先睡一会儿…');
  expect(vi.getTimerCount()).toBe(0);
});
