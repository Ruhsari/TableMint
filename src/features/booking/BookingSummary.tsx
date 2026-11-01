import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Href = { pathname: string; query: Record<string, string | number> };

export function BookingSummary({
  restaurantName,
  date,
  time,
  guests,
  continueHref,
}: {
  restaurantName: string;
  date: string;
  time: string | null;
  guests: number;
  continueHref: Href | null;
}) {
  const t = useTranslations('booking');

  const rows: [string, string][] = [
    [t('summaryRestaurant'), restaurantName],
    [t('summaryDate'), date],
    [t('summaryTime'), time ?? '—'],
    [t('summaryGuests'), String(guests)],
  ];

  const buttonClass =
    'mt-6 block w-full rounded-full bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600';

  return (
    <section aria-labelledby="summary-title" className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 id="summary-title" className="text-xl font-semibold">
        {t('summaryTitle')}
      </h2>

      <dl className="mt-4 divide-y divide-neutral-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-4">
            <dt className="text-neutral-500">{label}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      {continueHref ? (
        <Link href={continueHref} className={buttonClass}>
          {t('continue')}
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={`${buttonClass} cursor-not-allowed opacity-50 hover:bg-orange-500`}
        >
          {t('continue')}
        </button>
      )}
      <p className="mt-4 text-sm text-neutral-500">{t('autoTable')}</p>
    </section>
  );
}
