'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/features/auth/session';
import { cancelOwnerBooking, toggleContactStatus } from './cabinetStore';

export async function cancelBookingAction(bookingId: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'OWNER') return { ok: false };

  const result = cancelOwnerBooking(bookingId);
  if (result) revalidatePath('/', 'layout');
  return { ok: result };
}

export async function toggleContactAction(contactId: string): Promise<{ ok: boolean; newStatus?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'OWNER') return { ok: false };

  const updated = toggleContactStatus(contactId);
  if (updated) {
    revalidatePath('/', 'layout');
    return { ok: true, newStatus: updated.status };
  }
  return { ok: false };
}
