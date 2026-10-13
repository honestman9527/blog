export function formatDate(date: string, timezone: string): string {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: timezone })
    .format(new Date(`${date}T00:00:00+08:00`));
}
