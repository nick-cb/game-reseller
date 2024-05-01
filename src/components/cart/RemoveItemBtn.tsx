'use client';

import { Carts, Game } from '@/database/models/model';
import { useContext, useTransition } from 'react';
import { SnackContext } from '../SnackContext';
import { useRouter } from 'next/navigation';
import { LoadingIcon } from '../loading/LoadingIcon';
import { mergeCls } from '@/utils';
import CartActions from '@/actions/cart-actions';

type RemoveItemBtnProps = {
  cart: Pick<Carts, 'ID'>;
  game: Pick<Game, 'ID' | 'sale_price'> & { checked: boolean };
};
export function RemoveItemBtn(props: RemoveItemBtnProps) {
  const { cart, game } = props;
  const [removing, startRemove] = useTransition();
  const router = useRouter();
  const { showMessage } = useContext(SnackContext);

  return (
    <button
      onClick={async () => {
        startRemove(async () => {
          const { error } = await CartActions.carts.removeItemFromCart(cart.ID, { item: game });
          if (error) {
            return showMessage({ message: error.message, type: 'error' });
          }
          router.refresh();
        });
      }}
      className={mergeCls(
        'block rounded px-2 py-2 hover:bg-red-200/25 hover:text-red-400 focus:bg-red-200/25 focus:text-red-400',
        'text-white_primary/60 shadow-sm outline outline-1 transition-colors hover:shadow-default/25 focus:shadow-default/25 focus:outline-red-400',
        'w-full md:w-20'
      )}
    >
      <div className="mx-auto w-max">
        <LoadingIcon loading={removing} />
      </div>
      {!removing ? <span>Remove</span> : null}
    </button>
  );
}
