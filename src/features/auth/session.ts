export type CurrentUser = {
  id: string;
  displayName: string;
  role: 'CUSTOMER';
};

// ВРЕМЕННО. Заменится запросом getCurrentUser к API.
// MOCK_AUTH=customer в файле .env.local включает вход, иначе гость.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (process.env.MOCK_AUTH === 'customer') {
    return { id: 'demo-customer', displayName: 'Айтегин', role: 'CUSTOMER' };
  }
  return null;
}
