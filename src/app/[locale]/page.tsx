import { getTranslations } from 'next-intl/server';

export default async function CatalogPage() {
  const t = await getTranslations('catalog');
  return <h1 className="p-8 text-4xl font-bold">{t('title')}</h1>;
}