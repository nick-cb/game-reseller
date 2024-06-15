'use client';

import { useContext, useTransition } from 'react';
import { SnackContext } from '../../SnackContext';
import { useRouter } from 'next/navigation';
import { LoadingIcon } from '../../loading/LoadingIcon';
import CartActions from '@/+actions/cart-actions';
import { Button } from '@/components/Buttons';

type RemoveItemBtnProps = {
  cart: Pick<Carts, 'ID'>;
  item: Pick<Game, 'ID' | 'sale_price'> & { checked: boolean };
};
export function RemoveItemButton(props: RemoveItemBtnProps) {
  const { cart, item } = props;
  const [removing, startRemove] = useTransition();
  const router = useRouter();
  const { showMessage } = useContext(SnackContext);

  function handleClick() {
    startRemove(async () => {
      const { error } = await CartActions.carts.removeItemFromCart(cart.ID, { item });
      if (error) {
        return showMessage({ message: error.message, type: 'error' });
      }
      router.refresh();
    });
  }

  return (
    <Button onClick={handleClick} variant="severity" size="sm" className="min-w-28">
      <div className="absolute mx-auto w-max">
        <LoadingIcon loading={removing} />
      </div>
      {!removing ? 'Remove' : null}
    </Button>
  );
}
