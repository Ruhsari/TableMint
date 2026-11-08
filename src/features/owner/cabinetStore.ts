import { RESTAURANT_UTC_OFFSET, todayInRestaurantZone } from '@/lib/time';
import type { ContactRequest } from '@/features/contact/store';
import type { OwnerBooking } from './cabinet';

// ВРЕМЕННО. Моковые данные для экранов A7 и A8.
// Заменятся реальными запросами к API: listBookings(owner), listContactRequests(owner).

const today = todayInRestaurantZone();

function makeBooking(
  ref: string,
  name: string,
  phone: string,
  time: string,
  endTime: string,
  party: number,
  table: string,
  source: 'WEB' | 'TELEGRAM',
  status: 'CONFIRMED' | 'CANCELLED' = 'CONFIRMED',
): OwnerBooking {
  return {
    id: `ob-${ref}`,
    reference: ref,
    restaurantId: '1',
    guestName: name,
    guestPhone: phone,
    startsAt: `${today}T${time}:00${RESTAURANT_UTC_OFFSET}`,
    endsAt: `${today}T${endTime}:00${RESTAURANT_UTC_OFFSET}`,
    partySize: party,
    tableLabel: table,
    source,
    status,
  };
}

const seedBookings: OwnerBooking[] = [
  makeBooking('TM-4N8R2A', 'Айдана Садыкова', '+996 700 000 101', '10:00', '12:00', 2, 'Столик 1', 'WEB'),
  makeBooking('TM-6B2T9K', 'Тимур Осмонов', '+996 700 000 102', '12:30', '14:30', 1, 'Столик 2', 'TELEGRAM'),
  makeBooking('TM-7K3Q9P', 'Яна Мирова', '+996 700 000 103', '15:30', '17:30', 2, 'Столик 1', 'WEB'),
  makeBooking('TM-2D5L8M', 'Данияр Асанов', '+996 700 000 104', '16:00', '18:00', 2, 'Столик 2', 'TELEGRAM'),
  makeBooking('TM-9C4F7H', 'Алина Белова', '+996 700 000 105', '17:00', '19:00', 2, 'Столик 3', 'WEB', 'CANCELLED'),
  makeBooking('TM-3A6P8R', 'Нурлан Токтоев', '+996 700 000 106', '18:00', '20:00', 2, 'Столик 1', 'WEB'),
  makeBooking('TM-5M1S4V', 'Элина Ким', '+996 700 000 107', '19:00', '21:00', 1, 'Столик 4', 'TELEGRAM', 'CANCELLED'),
  makeBooking('TM-8H2W6N', 'Марат Алиев', '+996 700 000 108', '20:30', '22:30', 2, 'Столик 2', 'WEB'),
];

function makeContact(
  name: string,
  phone: string,
  message: string,
  subject: string,
  source: 'WEB' | 'TELEGRAM',
  daysAgo: number,
  time: string,
  status: 'NEW' | 'HANDLED' = 'NEW',
): ContactRequest {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const dateStr = d.toISOString().slice(0, 10);
  return {
    id: `cr-${name.replace(/\s/g, '-').toLowerCase()}-${Date.now() + Math.random()}`,
    restaurantId: '1',
    name,
    phone,
    email: '',
    message,
    source,
    status,
    createdAt: `${dateStr}T${time}:00${RESTAURANT_UTC_OFFSET}`,
  };
}

const seedContacts: ContactRequest[] = [
  makeContact(
    'Алина Белова',
    '+996 700 000 105',
    'Здравствуйте! Подскажите, пожалуйста, до скольки вы работаете в воскресенье? Хотим зайти вечером после прогулки.',
    'Уточнить часы работы',
    'WEB',
    0,
    '13:42',
  ),
  makeContact(
    'Данияр Асанов',
    '+996 700 000 104',
    'Добрый день! Есть ли вегетарианские позиции? Приедем компанией, нужно знать заранее.',
    'Вопрос о доступности меню',
    'TELEGRAM',
    0,
    '11:18',
  ),
  makeContact(
    'Элина Ким',
    '+996 700 000 107',
    'Подскажите, как добраться до ресторана на общественном транспорте? Какой маршрут ближайший?',
    'Как добраться до ресторана',
    'WEB',
    1,
    '18:30',
  ),
  makeContact(
    'Марат Алиев',
    '+996 700 000 108',
    'Можно ли прийти с детьми? Есть ли детское кресло?',
    'Вопрос о детском кресле',
    'WEB',
    3,
    '09:15',
    'HANDLED',
  ),
];

// --- Store ---
type CabinetStore = {
  bookings: OwnerBooking[];
  contacts: ContactRequest[];
};

const g = globalThis as typeof globalThis & { __tmCabinetStore?: CabinetStore };
const store: CabinetStore = (g.__tmCabinetStore ??= {
  bookings: seedBookings,
  contacts: seedContacts,
});

export function getOwnerBookings(): OwnerBooking[] {
  return store.bookings.map((b) => ({ ...b }));
}

export function cancelOwnerBooking(id: string): boolean {
  const b = store.bookings.find((x) => x.id === id);
  if (!b || b.status !== 'CONFIRMED') return false;
  // Нельзя отменить, если бронь уже началась
  if (new Date(b.startsAt).getTime() <= Date.now()) return false;
  b.status = 'CANCELLED';
  return true;
}

export function getCabinetContacts(): ContactRequest[] {
  return store.contacts.map((c) => ({ ...c }));
}

export function toggleContactStatus(id: string): ContactRequest | null {
  const c = store.contacts.find((x) => x.id === id);
  if (!c) return null;
  c.status = c.status === 'NEW' ? 'HANDLED' : 'NEW';
  return { ...c };
}
