import { useTranslations } from 'next-intl';
import type { Restaurant } from '@/mocks/restaurants';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const t = useTranslations('catalog');

  return (
    <article className="rounded-3xl bg-white p-3 shadow-sm">
      <div className="relative h-40 rounded-2xl bg-neutral-200">
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-medium">
          {restaurant.city}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 p-3">
        <div>
          <h3 className="text-lg font-bold">{restaurant.name}</h3>
          <p className="text-sm text-neutral-500">{restaurant.description}</p>
        </div>
        <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          {t('book')}
        </button>
      </div>
    </article>
  );
}