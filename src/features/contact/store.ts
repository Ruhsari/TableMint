// ВРЕМЕННО. Заглушка серверной части. Лимит и хранение на самом деле делает API
// (5 запросов в час на IP или на пользователя Telegram). Здесь лимит общий.

export type ContactRequest = {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: 'WEB' | 'TELEGRAM';
  status: 'NEW' | 'HANDLED';
  createdAt: string;
};

type Db = { items: ContactRequest[]; sentAt: number[] };
const g = globalThis as typeof globalThis & { __tmContacts?: Db };
const db: Db = (g.__tmContacts ??= { items: [], sentAt: [] });

const LIMIT = 5;
const WINDOW_MS = 60 * 60_000;

/** Через сколько секунд можно повторить; 0, если можно сейчас */
export function rateLimitRetryAfter(now = Date.now()): number {
  db.sentAt = db.sentAt.filter((t) => now - t < WINDOW_MS);
  if (db.sentAt.length < LIMIT) return 0;
  return Math.ceil((db.sentAt[0] + WINDOW_MS - now) / 1000);
}

export function addContactRequest(
  input: Omit<ContactRequest, 'id' | 'source' | 'status' | 'createdAt'>,
): ContactRequest {
  const item: ContactRequest = {
    ...input,
    id: crypto.randomUUID(),
    source: 'WEB',
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };
  db.items.push(item);
  db.sentAt.push(Date.now());
  return item;
}

export function listContactRequests(): ContactRequest[] {
  return db.items.map((i) => ({ ...i }));
}
