import { formatTime } from '@/lib/time';
import type { Booking, CreateBookingResult } from './types';

// ВРЕМЕННО. Замена операции createBooking.
// Сохранение ответа по ключу повторяет поведение API: тот же ключ даёт ту же бронь.
// Все проверки (слот, часы, опережение, столик) на самом деле делает API.
const saved = new Map<string, Booking>();

const noTable = {
  ru: 'На это время нет свободных столиков. Выберите другое время.',
  en: 'No free table at this time. Please choose another time.',
};

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeReference() {
  let s = 'TM-';
  for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

export async function createBooking(params: {
  restaurantId: string;
  startsAt: string; // ровно так, как его предложил getAvailability
  guests: number;
  idempotencyKey: string;
  locale: string;
}): Promise<CreateBookingResult> {
  const { startsAt, guests, idempotencyKey, locale } = params;
  await new Promise((resolve) => setTimeout(resolve, 700));

  const replay = saved.get(idempotencyKey);
  if (replay) return { booking: replay, problem: null };

  // Демо: время 20:00 всегда занято, чтобы увидеть состояние ошибки
  if (formatTime(startsAt, 'ru') === '20:00') {
    return {
      booking: null,
      problem: {
        code: 'BOOKING_NO_AVAILABILITY',
        title: noTable[locale === 'en' ? 'en' : 'ru'],
      },
    };
  }

  const booking: Booking = {
    id: crypto.randomUUID?.() ?? idempotencyKey,
    reference: makeReference(),
    startsAt,
    endsAt: new Date(new Date(startsAt).getTime() + 120 * 60_000).toISOString(),
    partySize: guests,
    status: 'CONFIRMED',
  };
  saved.set(idempotencyKey, booking);
  return { booking, problem: null };
}
