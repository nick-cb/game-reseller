import ItemOrderModal from '@/components/pages/game/OrderModal';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GameActions from '@/+actions/games-actions';
import { CheckoutView } from '@/components/pages/checkout/Checkout';
import UserActions from '@/+actions/users-actions';

export default async function ItemOrderModalPage({ params }: { params: any }) {
  const { slug } = params;
  const { data } = await GameActions.gameDetailPage.findBySlug(slug.replace('(.)', ''));
  const cookie = cookies().get('refresh_token');
  if (!cookie) {
    redirect('/');
  }
  const payload = UserActions.users.decodeToken({ token: cookie.value });
  if (typeof payload === 'string') {
    redirect('/');
  }

  if (!data) {
    redirect('/');
  }

  const game = { ...data, checked: true };

  return (
    <ItemOrderModal>
      <CheckoutView gameList={[game]} />
    </ItemOrderModal>
  );
}
