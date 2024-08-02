import { redirect } from 'next/navigation';
import GameActions from '@/+actions/games-actions';
import { CheckoutView } from '@/components/pages/checkout/Checkout';
import UserActions from '@/+actions/users-actions';

export type ExchangeRate = {
  date: string;
  usd: string;
};
export default async function ItemOrderPage({ params }: { params: any }) {
  const { slug } = params;
  const [{ data }, user] = await Promise.all([
    GameActions.gameDetailPage.findBySlug({ slug: slug.replace('(.)', '') }),
    UserActions.users.getUserInfoInCookie(),
  ]);
  if (!user) {
    return null;
  }

  if (!data) {
    redirect('/');
  }

  const game = { ...data, checked: true };

  return <CheckoutView gameList={[game]} />;
}
