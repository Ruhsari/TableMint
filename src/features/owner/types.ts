import type { ApiProblem } from '@/api/problem';
import type { MenuSection, OpeningHours } from '@/mocks/restaurants';

export type RestaurantStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export type SectionKey = 'details' | 'hours' | 'tables' | 'menu';
export const SECTION_KEYS: SectionKey[] = ['details', 'hours', 'tables', 'menu'];

export type OwnerTable = {
  id: string;
  label: string;
  seats: number;
  active: boolean;
};

export type OwnerRestaurant = {
  id: string;
  city: string;
  image?: string;
  status: RestaurantStatus;
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: OpeningHours[];
  tables: OwnerTable[];
  menu: MenuSection[];
};

export type DetailsValues = {
  name: string;
  description: string;
  address: string;
  phone: string;
};

export type DetailsState = {
  problem: ApiProblem | null;
  values: DetailsValues;
  saved: boolean;
};
