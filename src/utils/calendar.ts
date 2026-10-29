// Calendar export (.ics) and share text helpers

export function formatKoreanDate(dateStr: string, hour?: number): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const d = new Date(parseInt(year, 10), month - 1, day);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = weekdays[d.getDay()];

    if (hour !== undefined) {
      const startH = hour.toString().padStart(2, '0');
      const endH = (hour + 1).toString().padStart(2, '0');
      return `${month}월 ${day}일 (${dayOfWeek}) ${startH}:00 ~ ${endH}:00`;
    }
    return `${month}월 ${day}일 (${dayOfWeek})`;
  } catch {
    return dateStr;
  }
}

export function generateICSContent(
  title: string,
  description: string,
  location: string,
  dateStr: string,
  hour: number
): string {
  const parts = dateStr.split('-');
  const year = parts[0];
  const month = parts[1].padStart(2, '0');
  const day = parts[2].padStart(2, '0');

  const startH = hour.toString().padStart(2, '0');
  const endH = (hour + 2).toString().padStart(2, '0'); // default 2 hours meetup block

  const dtStart = `${year}${month}${day}T${startH}0000`;
  const dtEnd = `${year}${month}${day}T${endH}0000`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Golden Apple Meetup//KR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:golden-apple-${Date.now()}@meetup.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:🍎 ${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location || '온라인 / 추후 공지'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICSFile(
  title: string,
  description: string,
  location: string,
  dateStr: string,
  hour: number
) {
  const content = generateICSContent(title, description, location, dateStr, hour);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `약속_${dateStr}_황금사과.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
