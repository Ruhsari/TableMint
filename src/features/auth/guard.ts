import { redirect } from '@/i18n/navigation';
import { getCurrentUser } from './session';

// Если не вошли, отправляем на вход и вернём обратно после входа
export async function requireUser(locale: string, next: string) {
  const user = await getCurrentUser();
  if (!user) redirect({ href: { pathname: '/login', query: { next } }, locale });
  return user;
}
