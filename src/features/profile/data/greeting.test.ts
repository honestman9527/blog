import { expect, it } from 'vitest';
import { getGreeting } from './greeting';

it.each([
  [0, '夜深了，欢迎来坐坐。'],
  [4, '夜深了，欢迎来坐坐。'],
  [5, '早上好，欢迎来坐坐。'],
  [10, '早上好，欢迎来坐坐。'],
  [11, '中午好，欢迎来坐坐。'],
  [13, '中午好，欢迎来坐坐。'],
  [14, '下午好，欢迎来坐坐。'],
  [17, '下午好，欢迎来坐坐。'],
  [18, '晚上好，欢迎来坐坐。'],
  [23, '晚上好，欢迎来坐坐。'],
])('shows the local-time greeting at hour %i', (hour, expected) => {
  expect(getGreeting(hour)).toBe(expected);
});
