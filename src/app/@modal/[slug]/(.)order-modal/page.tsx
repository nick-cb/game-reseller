import ItemOrderModal from '@/components/pages/game/OrderModal';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GameActions from '@/+actions/games-actions';
import { CheckoutView } from '@/components/pages/checkout/Checkout';
import UserActions from '@/+actions/users-actions';
import { z } from 'zod';

export default async function ItemOrderModalPage({ params }: PageProps) {
  const slug = z
    .string()
    .catch('')
    .transform((a) => a.replace('(.)', ''))
    .parse(params.slug);
  const { data } = await GameActions.gameDetailPage.findBySlug({ slug });
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
