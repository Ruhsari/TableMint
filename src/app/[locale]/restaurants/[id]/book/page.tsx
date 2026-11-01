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

type SearchParams = {
  date?: string | string[];
  guests?: string | string[];
  startsAt?: string | string[];
};

const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : '');

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const restaurant = await fetchRestaurant(id);
  if (!restaurant) notFound();

  const t = await getTranslations('booking');
  const tr = await getTranslations('restaurant');

  // Значения из адреса только подставляются в форму. Правила проверяет API.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(one(sp.date)) ? one(sp.date) : todayInRestaurantZone();
  const parsedGuests = Number.parseInt(one(sp.guests), 10);
  const guests = Number.isInteger(parsedGuests) && parsedGuests >= 1 ? parsedGuests : 1;
  const slot = one(sp.startsAt) || null;

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
              initialDate={date}
              initialGuests={guests}
              initialSlot={slot}
            />
          </div>

          <RestaurantAside restaurant={restaurant} />
        </div>
      </main>
    </>
  );
}
