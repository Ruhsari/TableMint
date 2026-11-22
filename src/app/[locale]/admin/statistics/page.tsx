import { getTranslations, setRequestLocale } from 'next-intl/server';
import { requireStaff } from '@/features/auth/guard';
import { CabinetShell } from '@/features/owner/CabinetShell';
import { fetchManagedRestaurant } from '@/features/restaurants/data';
import { redirect } from '@/i18n/navigation';

// ВРЕМЕННО: экран S1 (StatsDashboard) будет следующим
export default async function StatisticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireStaff(locale, '/admin/statistics');
  if (user.role === 'MODERATOR') redirect({ href: '/admin/stats', locale });
  if (user.role !== 'OWNER') redirect({ href: '/admin', locale });

  const t = await getTranslations('cabinet');
  const tw = await getTranslations('workspace');
  const restaurant = await fetchManagedRestaurant();

  return (
    <CabinetShell restaurant={restaurant} active="statistics">
      <h1 className="text-4xl font-bold">{t('navStats')}</h1>
      <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-neutral-500">{tw('statsSoon')}</p>
      </section>
    </CabinetShell>
  );
}
