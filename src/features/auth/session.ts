import { cookies } from 'next/headers';

export const MOCK_SESSION_COOKIE = 'tm_mock_session';

export type CurrentUser = {
  id: string;
  displayName: string;
  role: 'CUSTOMER';
};

// ВРЕМЕННО. Заменится запросом getCurrentUser к API.
// Настоящая сессия будет в cookie HttpOnly, которую ставит сервер.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const value = (await cookies()).get(MOCK_SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    return { id: 'demo-customer', displayName: decodeURIComponent(value), role: 'CUSTOMER' };
  } catch {
    return null;
  }
}
