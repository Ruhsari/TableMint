import { getTranslations, setRequestLocale } from 'next-intl/server';
import { requireStaff } from '@/features/auth/guard';

export default async function AdminHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireStaff(locale, '/admin');

  const t = await getTranslations('owner');

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">{t('dashboardTitle')}</h1>
      <p className="mt-2 text-neutral-500">{t('dashboardNext')}</p>
    </section>
  );
}
