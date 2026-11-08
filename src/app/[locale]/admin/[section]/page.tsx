import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { requireStaff } from '@/features/auth/guard';
import { OwnerShell } from '@/features/owner/OwnerShell';
import { getReadiness } from '@/features/owner/readiness';
import { SECTION_META } from '@/features/owner/sections';
import type { SectionKey } from '@/features/owner/types';
import { fetchManagedRestaurant } from '@/features/restaurants/data';
import { Link, redirect } from '@/i18n/navigation';

// Все четыре раздела теперь имеют собственные страницы.
// Эта заглушка больше не срабатывает ни для одного из них.
const PENDING: SectionKey[] = [];

export default async function SectionPlaceholderPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  setRequestLocale(locale);
  if (!(PENDING as string[]).includes(section)) notFound();
  const key = section as SectionKey;

  const user = await requireStaff(locale, `/admin/${section}`);
  if (user.role !== 'OWNER') redirect({ href: '/admin', locale });

  const t = await getTranslations('panel');
  const restaurant = await fetchManagedRestaurant();
  const readiness = getReadiness(restaurant);
  const name = t(SECTION_META[key].nav);

  return (
    <OwnerShell restaurant={restaurant} readiness={readiness} active={key}>
      <h1 className="text-4xl font-bold">{name}</h1>
      <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-neutral-500">{t('comingSoon')}</p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-neutral-50"
        >
          {t('toOverview')}
        </Link>
      </section>
    </OwnerShell>
  );
}
