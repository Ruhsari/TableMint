'use client';

import { useRef, useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { ApiProblem } from '@/api/problem';
import { ApiMessage } from '@/components/ApiMessage';
import { Link } from '@/i18n/navigation';
import { formatDate, formatTime } from '@/lib/time';
import { newIdempotencyKey } from '@/lib/uuid';
import { createBooking } from './createBooking';
import type { Booking } from './types';

type Props = {
  restaurantId: string;
  restaurantName: string;
  address: string;
  startsAt: string;
  guests: number;
  canConfirm: boolean;
};

export function ConfirmCard({
  restaurantId,
  restaurantName,
  address,
  startsAt,
  guests,
  canConfirm,
}: Props) {
  const t = useTranslations('booking');
  const locale = useLocale();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [problem, setProblem] = useState<ApiProblem | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Один ключ на одну попытку: повторное нажатие или повтор после сбоя сети
  // уходят с тем же ключом, поэтому вторая бронь не создаётся.
  const keyRef = useRef<string | null>(null);
  // Защита от двойного клика: state обновляется не мгновенно, ref мгновенно.
  const inFlight = useRef(false);

  const dateText = formatDate(startsAt, locale);
  const timeText = formatTime(startsAt, locale);

  async function submit() {
    if (!canConfirm || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setProblem(null);
    setNetworkError(false);

    const key = (keyRef.current ??= newIdempotencyKey());
    try {
      const result = await createBooking({
        restaurantId,
        startsAt,
        guests,
        idempotencyKey: key,
        locale,
      });
      if (result.booking) {
        setBooking(result.booking);
      } else {
        setProblem(result.problem);
        keyRef.current = null; // окончательный отказ: следующая попытка с новым ключом
      }
    } catch {
      setNetworkError(true); // ключ остаётся прежним
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  // Временный экран успеха. Его заменит экран C5.
  if (booking) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm" aria-live="polite">
        <div className="flex items-center gap-3">
          <CircleCheck className="h-6 w-6 text-orange-500" aria-hidden />
          <h2 className="text-xl font-semibold">{t('successTitle')}</h2>
        </div>
        <p className="mt-6 text-sm text-neutral-500">{t('successCode')}</p>
        <p className="mt-1 text-3xl font-bold tracking-wider">{booking.reference}</p>
        <p className="mt-4 text-neutral-500">
          {t('successHint', { date: dateText, time: timeText })}
        </p>
        <Link
          href="/"
          className="mt-6 block w-full rounded-full bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600"
        >
          {t('toCatalog')}
        </Link>
      </section>
    );
  }

  const rows: [string, string][] = [
    [t('summaryDate'), dateText],
    [t('summaryTime'), timeText],
    [t('summaryGuests'), String(guests)],
    [t('address'), address],
  ];

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">{restaurantName}</h2>

      <dl className="mt-4 divide-y divide-neutral-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-4">
            <dt className="text-neutral-500">{label}</dt>
            <dd className="text-right font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 space-y-3" aria-live="polite">
        {problem && <ApiMessage problem={problem} />}
        {networkError && (
          <ApiMessage problem={{ code: 'NETWORK_ERROR', title: t('networkError') }} />
        )}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canConfirm || submitting}
        className="mt-6 w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500"
      >
        {submitting ? t('submitting') : t('confirmAction')}
      </button>
      <p className="mt-4 text-sm text-neutral-500">{t('idempotencyHint')}</p>
    </section>
  );
}
