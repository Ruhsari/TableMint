import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/SiteHeader';
import { BookingPicker } from '@/features/booking/BookingPicker';
import { RestaurantAside } from '@/features/booking/RestaurantAside';
import { fetchRestaurant } from '@/features/restaurants/data';
import { Link } from '@/i18n/navigation';
import { todayInRestaurantZone } from '@/lib/time';

// «Сегодня» меняется каждый день, поэтому страницу нельзя кэшировать при сборке
export const dynamic = 'force-dynamic';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const restaurant = await fetchRestaurant(id);
  if (!restaurant) notFound();

  const t = await getTranslations('booking');
  const tr = await getTranslations('restaurant');

  const first = restaurant.hours[0];
  const daily =
    !!first &&
    restaurant.hours.length === 7 &&
    restaurant.hours.every((h) => h.opens === first.opens && h.closes === first.closes);
  const hoursText = daily
    ? t('hoursDaily', { from: first.opens, to: first.closes })
    : t('hoursVaries');

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-sm text-orange-500 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {tr('breadcrumbBack')}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{t('title')}</h1>
              <p className="mt-1 text-sm text-neutral-500">
                {restaurant.name} · {restaurant.city} · {hoursText}
              </p>
            </div>

            <BookingPicker
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              initialDate={todayInRestaurantZone()}
            />
          </div>

          <RestaurantAside restaurant={restaurant} />
        </div>
      </main>
    </>
  );
}
