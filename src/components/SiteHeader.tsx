import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

export function SiteHeader() {
  const t = useTranslations('nav');

  return (
    <header className="mx-auto mt-8 flex max-w-6xl items-center justify-between rounded-full bg-white px-8 py-4 shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-orange-100" />
        <span className="text-xl font-semibold">TableMint</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/"
          className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-600"
        >
          {t('catalog')}
        </Link>
        <span className="text-neutral-500">{t('about')}</span>
      </nav>

      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          {t('login')}
        </button>
      </div>
    </header>
  );
}