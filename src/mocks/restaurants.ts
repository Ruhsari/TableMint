export type Restaurant = {
  id: string;
  name: string;
  city: string;
  description: string;
};

export const restaurants: Restaurant[] = [
  { id: '1', name: 'Мята и свет', city: 'Бишкек', description: 'Современная кухня · Светлый зал' },
  { id: '2', name: 'Тихий двор', city: 'Ош', description: 'Восточная кухня · Зелёный дворик' },
  { id: '3', name: 'Зелёный уголок', city: 'Бишкек', description: 'Вегетарианская кухня · Уютный зал' },
  { id: '4', name: 'Кофейная гавань', city: 'Каракол', description: 'Кофе и десерты · Комфортная терраса' },
];