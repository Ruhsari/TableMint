import { LogOut } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from '@/features/auth/actions';
import { getCurrentUser } from '@/features/auth/session';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

export async function SiteHeader() {
  const t = await getTranslations('nav');
  const user = await getCurrentUser();

  return (
    <header className="mx-auto mt-8 flex max-w-6xl items-center justify-between rounded-full bg-white px-8 py-4 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#FDE7E0]" />
        <span className="text-xl font-semibold">TableMint</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/"
          className="rounded-full bg-[#FDE7E0] px-4 py-2 font-semibold text-orange-600"
        >
          {t('catalog')}
        </Link>
        {/* «Мои брони» станет ссылкой, когда будет экран C6 */}
        {user && <span className="text-neutral-500">{t('myBookings')}</span>}
        <span className="text-neutral-500">{t('about')}</span>
      </nav>

      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        {user ? (
          <>
            <span className="max-w-[10rem] truncate rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white">
              {user.displayName}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label={t('logout')}
                title={t('logout')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
}
