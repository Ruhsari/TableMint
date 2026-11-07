'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocalePills() {
  const t = useTranslations('owner');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t('language')} className="flex rounded-full bg-neutral-50 p-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            l === locale
              ? 'bg-[#FDE7E0] text-orange-600'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
