import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

// Execute the actual early inline script without a browser or layout inspection.
const component = readFileSync(new URL('../ui/HomeIntro.astro', import.meta.url), 'utf8');
const script = component.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('HomeIntro must have an early inline script.');

let intro: { hidden: boolean };
let motion: EventTarget & { matches: boolean };
let documentTarget: EventTarget & {
  visibilityState: string;
  querySelector: () => typeof intro | null;
};
let windowTarget: EventTarget;
let storage: Map<string, string>;

const start = (storageAvailable = true) => {
  runInNewContext(script, {
    document: documentTarget,
    window: Object.assign(windowTarget, {
      matchMedia: () => motion,
      sessionStorage: {
        getItem: (key: string) => {
          if (!storageAvailable) throw new Error('Storage blocked');
          return storage.get(key) ?? null;
        },
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      setTimeout,
      clearTimeout,
    }),
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  intro = { hidden: true };
  motion = Object.assign(new EventTarget(), { matches: false });
  documentTarget = Object.assign(new EventTarget(), {
    visibilityState: 'visible',
    querySelector: (): typeof intro | null => intro,
  });
  windowTarget = new EventTarget();
  storage = new Map();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

it('plays the first home visit and ends after 1.2 seconds without awaiting resources', () => {
  start();
  expect(intro.hidden).toBe(false);
  expect(storage.get('profile:home-intro-seen')).toBe('true');
  vi.advanceTimersByTime(1199);
  expect(intro.hidden).toBe(false);
  vi.advanceTimersByTime(1);
  expect(intro.hidden).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it('does not replay when returning to or refreshing home in the same session', () => {
  start();
  vi.runAllTimers();
  start();
  expect(intro.hidden).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it('skips animation for reduced motion', () => {
  motion.matches = true;
  start();
  expect(intro.hidden).toBe(true);
  expect(storage.size).toBe(0);
  expect(vi.getTimerCount()).toBe(0);
});

it('does not start an entrance when initially opened in a background tab', () => {
  documentTarget.visibilityState = 'hidden';
  start();
  expect(intro.hidden).toBe(true);
  expect(storage.size).toBe(0);
});

it('leaves the content unobstructed when storage is blocked', () => {
  start(false);
  expect(intro.hidden).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it('leaves the content unobstructed when the session marker cannot be written', () => {
  vi.spyOn(storage, 'set').mockImplementation(() => {
    throw new Error('Quota exceeded');
  });
  start();
  expect(intro.hidden).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it('does nothing when no avatar intro is rendered', () => {
  documentTarget.querySelector = () => null;
  start();
  expect(storage.size).toBe(0);
  expect(vi.getTimerCount()).toBe(0);
});

it.each(['keydown', 'pointerdown', 'visibilitychange'])(
  'immediately skips on %s and removes event listeners',
  (type) => {
    const removeDocument = vi.spyOn(documentTarget, 'removeEventListener');
    const removeWindow = vi.spyOn(windowTarget, 'removeEventListener');
    const removeMotion = vi.spyOn(motion, 'removeEventListener');
    start();
    documentTarget.dispatchEvent(new Event(type));
    expect(intro.hidden).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(removeDocument).toHaveBeenCalledTimes(3);
    expect(removeWindow).toHaveBeenCalledTimes(1);
    expect(removeMotion).toHaveBeenCalledTimes(1);
  },
);

it('finishes before leaving, so back/forward cache cannot replay the overlay', () => {
  start();
  windowTarget.dispatchEvent(new Event('pagehide'));
  windowTarget.dispatchEvent(new Event('pageshow'));
  expect(intro.hidden).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it('immediately stops when the reduced-motion preference changes', () => {
  start();
  motion.matches = true;
  motion.dispatchEvent(new Event('change'));
  expect(intro.hidden).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});
