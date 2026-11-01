import { getTranslations } from 'next-intl/server';
import { SiteHeader } from '@/components/SiteHeader';
import { RestaurantGrid } from '@/features/restaurants/RestaurantGrid';
import { restaurants } from '@/mocks/restaurants';

export default async function CatalogPage() {
  const t = await getTranslations('catalog');

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[380px_1fr]">
        <section>
          <p className="text-sm font-medium text-orange-500">{t('region')}</p>
          <h1 className="mt-2 text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-neutral-500">{t('subtitle')}</p>

          <input
            type="search"
            placeholder={t('search')}
            aria-label={t('search')}
            className="mt-8 w-full rounded-2xl bg-white px-5 py-4 shadow-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <p className="mt-6 rounded-2xl bg-orange-50 px-5 py-4 text-sm text-orange-900">
            {t('notice')}
          </p>
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-bold">{t('listTitle')}</h2>
              <p className="text-xs text-neutral-500">{t('listHint')}</p>
            </div>
            <span className="text-sm text-neutral-500">
              {t('count', { count: restaurants.length })}
            </span>
          </div>
          <RestaurantGrid items={restaurants} />
        </section>
      </main>
    </>
  );
}