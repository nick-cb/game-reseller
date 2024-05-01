'use client';

import { useParams, useRouter } from 'next/navigation';
import { Game } from '@/database/models/model';
import { useContext, useTransition } from 'react';
import { SnackContext } from '../SnackContext';
import { LoadingIcon } from '../loading/LoadingIcon';
import ShareActions from '@/actions2/share';

export function AddToCartButton({ game }: { game: Pick<Game, 'ID' | 'slug' | 'name'> }) {
  const router = useRouter();
  const params = useParams();
  const { showMessage } = useContext(SnackContext);
  const [adding, startAddToCart] = useTransition();

  const addItemToCart = async () => {
    const isLogin = await ShareActions.users.checkLoginStatus();
    if (!isLogin) {
      router.push(`/login?type=modal&order=${game.slug}`);
      return;
    }
    startAddToCart(async () => {
      if (typeof params['slug'] !== 'string') {
        return;
      }
      const { error } = await ShareActions.carts.addItemToCart({ game: { ID: game.ID } });
      router.refresh();
      if (error) {
        return showMessage({ message: error.message, type: 'error' });
      }
      return showMessage({ message: 'Added ' + game.name + ' to cart', type: 'success' });
    });
  };

  return (
    <button
      className="w-full rounded border border-white/60 py-2
                text-sm text-white transition-colors hover:bg-paper"
      onClick={addItemToCart}
    >
      <div className="mx-auto w-max">
        <LoadingIcon loading={adding} />
      </div>
      {!adding ? <span>Add to cart</span> : null}
    </button>
  );
}
