import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import GameDetailActions from '@/actions/game-detail-actions';
import { CheckoutView } from '@/components/checkout/Checkout';
import ShareActions from '@/actions/share';

export type ExchangeRate = {
  date: string;
  usd: string;
};
export default async function ItemOrderPage({ params }: { params: any }) {
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
    <div className="flex grid-cols-[calc(70%-32px)_30%] flex-col-reverse gap-8 md:grid md:grid-rows-[minmax(0px,auto)_min-content]">
      <CheckoutView gameList={[game]} />
    </div>
  );
}
