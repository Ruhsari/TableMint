'use server';

import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { MOCK_SESSION_COOKIE } from './session';
import type { AuthState } from './types';

// ВРЕМЕННО. Заглушки операций login, registerCustomer и logout.
// Настоящие проверки и сообщения (RU/EN) будут приходить от API.
const text = {
  ru: {
    validation: 'Проверьте отмеченные поля.',
    invalid: 'Неверный email или пароль.',
    taken: 'Аккаунт с таким email уже существует.',
    consent: 'Чтобы продолжить, дайте согласие на обработку персональных данных.',
    required: 'Заполните поле.',
    password: 'Пароль не короче 10 символов.',
  },
  en: {
    validation: 'Please check the highlighted fields.',
    invalid: 'Wrong email or password.',
    taken: 'An account with this email already exists.',
    consent: 'Please agree to the processing of your personal data to continue.',
    required: 'Fill in this field.',
    password: 'Password must be at least 10 characters.',
  },
};

// Принимаем только внутренние адреса, иначе возможен редирект на чужой сайт
function safeNext(value: FormDataEntryValue | null): string {
  const s = typeof value === 'string' ? value : '';
  return s.startsWith('/') && !s.startsWith('//') && !s.includes('\\') ? s : '/';
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] || email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

async function startSession(displayName: string) {
  (await cookies()).set(MOCK_SESSION_COOKIE, encodeURIComponent(displayName), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim();
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = await getLocale();
  const tx = text[locale === 'en' ? 'en' : 'ru'];

  const email = field(formData, 'email');
  const password = String(formData.get('password') ?? '');
  const next = safeNext(formData.get('next'));

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = tx.required;
  if (!password) fieldErrors.password = tx.required;
  if (Object.keys(fieldErrors).length > 0) {
    return {
      values: { email },
      problem: { code: 'VALIDATION_FAILED', title: tx.validation, fieldErrors },
    };
  }

  // Демо-сценарий неверного входа: пароль «wrong»
  if (password === 'wrong') {
    return { values: { email }, problem: { code: 'INVALID_CREDENTIALS', title: tx.invalid } };
  }

  await startSession(nameFromEmail(email));
  redirect({ href: next, locale });
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = await getLocale();
  const tx = text[locale === 'en' ? 'en' : 'ru'];

  const displayName = field(formData, 'displayName');
  const email = field(formData, 'email');
  const phone = field(formData, 'phone');
  const password = String(formData.get('password') ?? '');
  const consent = formData.get('consent') === 'on';
  const next = safeNext(formData.get('next'));
  const values = { email, displayName, phone };

  const fieldErrors: Record<string, string> = {};
  if (!displayName) fieldErrors.displayName = tx.required;
  if (!email) fieldErrors.email = tx.required;
  if (!password) fieldErrors.password = tx.required;
  else if (password.length < 10) fieldErrors.password = tx.password;
  if (Object.keys(fieldErrors).length > 0) {
    return { values, problem: { code: 'VALIDATION_FAILED', title: tx.validation, fieldErrors } };
  }

  if (!consent) {
    return {
      values,
      problem: {
        code: 'CONSENT_REQUIRED',
        title: tx.consent,
        fieldErrors: { consent: tx.consent },
      },
    };
  }

  // Демо-сценарий занятого email
  if (email.toLowerCase() === 'taken@example.kg') {
    return {
      values,
      problem: {
        code: 'EMAIL_ALREADY_REGISTERED',
        title: tx.taken,
        fieldErrors: { email: tx.taken },
      },
    };
  }

  await startSession(displayName);
  redirect({ href: next, locale });
}

export async function logoutAction(): Promise<void> {
  const locale = await getLocale();
  (await cookies()).delete(MOCK_SESSION_COOKIE);
  redirect({ href: '/', locale });
}
