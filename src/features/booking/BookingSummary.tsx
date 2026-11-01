import { useTranslations } from 'next-intl';

export function BookingSummary({
  restaurantName,
  date,
  time,
  guests,
  canContinue,
}: {
  restaurantName: string;
  date: string;
  time: string | null;
  guests: number;
  canContinue: boolean;
}) {
  const t = useTranslations('booking');

  const rows: [string, string][] = [
    [t('summaryRestaurant'), restaurantName],
    [t('summaryDate'), date],
    [t('summaryTime'), time ?? '—'],
    [t('summaryGuests'), String(guests)],
  ];

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

      <button
        type="button"
        disabled={!canContinue}
        className="mt-6 w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500"
      >
        {t('continue')}
      </button>
      <p className="mt-4 text-sm text-neutral-500">{t('autoTable')}</p>
    </section>
  );
}
