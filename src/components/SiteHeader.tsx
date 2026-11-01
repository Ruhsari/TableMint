import { useTranslations } from 'next-intl';

export function SiteHeader() {
  const t = useTranslations('nav');

  return (
    <header className="mx-auto mt-8 flex max-w-6xl items-center justify-between rounded-full bg-white px-8 py-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-orange-100" />
        <span className="text-xl font-semibold">TableMint</span>
      </div>

      <nav className="flex items-center gap-6 text-sm">
        <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-600">
          {t('catalog')}
        </span>
        <span className="text-neutral-500">{t('about')}</span>
      </nav>

      <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
        {t('login')}
      </button>
    </header>
  );
}