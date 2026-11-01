export const RESTAURANT_TIME_ZONE = 'Asia/Bishkek';
export const RESTAURANT_UTC_OFFSET = '+06:00';

function intlLocale(locale: string) {
  return locale === 'en' ? 'en-GB' : 'ru-RU';
}

/** Сегодняшняя дата в часовом поясе ресторана: 'YYYY-MM-DD' */
export function todayInRestaurantZone(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: RESTAURANT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** '2026-10-29T19:00:00+06:00' -> '19:00' (во времени ресторана) */
export function formatTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: RESTAURANT_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
}

/** '2026-10-29' -> '29 октября' */
export function formatDateOnly(date: string, locale: string): string {
  const d = new Date(`${date}T12:00:00${RESTAURANT_UTC_OFFSET}`);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: RESTAURANT_TIME_ZONE,
    day: 'numeric',
    month: 'long',
  }).format(d);
}
