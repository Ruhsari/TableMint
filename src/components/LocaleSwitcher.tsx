'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      aria-label={t('label')}
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="rounded-full bg-transparent px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {t(l)}
        </option>
      ))}
    </select>
  );
}
