import { SiteHeader } from '@/components/SiteHeader';
import { RestaurantCatalog } from '@/features/restaurants/RestaurantCatalog';
import { restaurants } from '@/mocks/restaurants';

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[380px_1fr]">
        <RestaurantCatalog items={restaurants} />
      </main>
    </>
  );
}