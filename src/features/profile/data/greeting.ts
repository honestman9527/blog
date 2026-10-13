export function getGreeting(hour: number): string {
  if (hour < 5) return '夜深了，欢迎来坐坐。';
  if (hour < 11) return '早上好，欢迎来坐坐。';
  if (hour < 14) return '中午好，欢迎来坐坐。';
  if (hour < 18) return '下午好，欢迎来坐坐。';
  return '晚上好，欢迎来坐坐。';
}
