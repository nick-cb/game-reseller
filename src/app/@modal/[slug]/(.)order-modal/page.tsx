import ItemOrderModal from '@/components/game/OrderModal';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GameDetailActions from '@/actions2/game-detail-actions';
import ShareActions from '@/actions2/share';
import { CheckoutView } from '@/components/checkout/Checkout';

export default async function ItemOrderModalPage({ params }: { params: any }) {
  const { slug } = params;
  const { data } = await GameDetailActions.games.findBySlug(slug.replace('(.)', ''));
  const cookie = cookies().get('refresh_token');
  if (!cookie) {
    redirect('/');
  }
  const payload = ShareActions.users.decodeToken({ token: cookie.value });
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
