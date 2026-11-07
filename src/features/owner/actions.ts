'use server';

import { revalidatePath } from 'next/cache';
import { getLocale } from 'next-intl/server';
import type { ApiProblem } from '@/api/problem';
import { getCurrentUser } from '@/features/auth/session';
import { getReadiness } from './readiness';
import { getOwnerRestaurant, setStatus, updateDetails } from './store';
import type { DetailsState } from './types';

// ВРЕМЕННО. Заглушки операций updateRestaurant и setPublication.
// Настоящие проверки и сообщения (RU/EN) будут приходить от API.
const text = {
  ru: {
    validation: 'Проверьте отмеченные поля.',
    required: 'Заполните поле.',
    unauthenticated: 'Войдите, чтобы продолжить.',
    forbidden: 'У вас нет доступа к этому действию.',
    passwordChange: 'Задайте новый пароль, чтобы продолжить.',
    notReady:
      'Перед публикацией добавьте часы работы, активный столик и хотя бы одну позицию меню.',
  },
  en: {
    validation: 'Please check the highlighted fields.',
    required: 'Fill in this field.',
    unauthenticated: 'Please sign in to continue.',
    forbidden: "You don't have access to this action.",
    passwordChange: 'Set a new password to continue.',
    notReady: 'Add opening hours, an active table and a menu item before publishing.',
  },
};

type Texts = (typeof text)['ru'];

// Права: действия доступны только владельцу, сменившему временный пароль
async function ownerGate(tx: Texts): Promise<ApiProblem | null> {
  const user = await getCurrentUser();
  if (!user) return { code: 'UNAUTHENTICATED', title: tx.unauthenticated };
  if (user.role !== 'OWNER') return { code: 'FORBIDDEN', title: tx.forbidden };
  if (user.mustChangePassword) {
    return { code: 'PASSWORD_CHANGE_REQUIRED', title: tx.passwordChange };
  }
  return null;
}

const field = (fd: FormData, name: string) => String(fd.get(name) ?? '').trim();

export async function saveDetailsAction(
  _prev: DetailsState,
  formData: FormData,
): Promise<DetailsState> {
  const locale = await getLocale();
  const tx = text[locale === 'en' ? 'en' : 'ru'];

  const values = {
    name: field(formData, 'name'),
    description: field(formData, 'description'),
    address: field(formData, 'address'),
    phone: field(formData, 'phone'),
  };

  const denied = await ownerGate(tx);
  if (denied) return { values, saved: false, problem: denied };

  const fieldErrors: Record<string, string> = {};
  if (!values.name) fieldErrors.name = tx.required;
  if (!values.address) fieldErrors.address = tx.required;
  if (!values.phone) fieldErrors.phone = tx.required;
  if (Object.keys(fieldErrors).length > 0) {
    return {
      values,
      saved: false,
      problem: { code: 'VALIDATION_FAILED', title: tx.validation, fieldErrors },
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  updateDetails(values);
  revalidatePath('/', 'layout');
  return { values, saved: true, problem: null };
}

export async function setPublicationAction(input: {
  published: boolean;
}): Promise<{ problem: ApiProblem | null }> {
  const locale = await getLocale();
  const tx = text[locale === 'en' ? 'en' : 'ru'];

  const denied = await ownerGate(tx);
  if (denied) return { problem: denied };

  // Снять с публикации можно всегда, опубликовать только готовый ресторан
  if (input.published && !getReadiness(getOwnerRestaurant()).canPublish) {
    return { problem: { code: 'RESTAURANT_NOT_READY', title: tx.notReady } };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  setStatus(input.published ? 'PUBLISHED' : 'HIDDEN');
  revalidatePath('/', 'layout');
  return { problem: null };
}
