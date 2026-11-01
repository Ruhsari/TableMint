import { getTranslations } from 'next-intl/server';
import { restaurants } from '@/mocks/restaurants';
import { RestaurantGrid } from '@/features/restaurants/RestaurantGrid';

export default async function CatalogPage() {
  const t = await getTranslations('catalog');

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[360px_1fr]">
      <section>
        <h1 className="text-5xl font-bold">{t('title')}</h1>
        <p className="mt-3 text-neutral-500">{t('subtitle')}</p>
        <input
          type="search"
          placeholder={t('search')}
          aria-label={t('search')}
          className="mt-8 w-full rounded-2xl bg-white px-5 py-4 shadow-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </section>

      <section>
        <RestaurantGrid items={restaurants} />
      </section>
    </main>
  );
}