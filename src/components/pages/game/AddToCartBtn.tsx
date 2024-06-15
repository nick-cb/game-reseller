'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContext, useTransition } from 'react';
import { SnackContext } from '../../SnackContext';
import { LoadingIcon } from '../../loading/LoadingIcon';
import CartActions from '@/+actions/cart-actions';
import UserActions from '@/+actions/users-actions';
import { Button, ButtonProps } from '@/components/Buttons';

type AddToCartButtonProps = Exclude<ButtonProps, 'variant'> & {
  game: Pick<Game, 'ID' | 'slug' | 'name'>;
};
export function AddToCartButton(props: AddToCartButtonProps) {
  const { game, children, ...rest } = props;
  const router = useRouter();
  const params = useParams();
  const { showMessage } = useContext(SnackContext);
  const [adding, startAddToCart] = useTransition();

  const addItemToCart = async () => {
    const isLogin = await UserActions.users.checkLoginStatus();
    if (!isLogin) {
      router.push(`/login?type=modal&order=${game.slug}`);
      return;
    }
    startAddToCart(async () => {
      if (typeof params['slug'] !== 'string') {
        return;
      }
      const { error } = await CartActions.carts.addItemToCart({ game: { ID: game.ID } });
      router.refresh();
      if (error) {
        return showMessage({ message: error.message, type: 'error' });
      }
      return showMessage({ message: 'Added ' + game.name + ' to cart', type: 'success' });
    });
  };

  return (
    <Button variant="secondary" onClick={addItemToCart} {...rest}>
      <div className="absolute">
        <LoadingIcon loading={adding} />
      </div>
      {!adding ? (children ?? <span>Add to cart</span>) : null}
    </Button>
  );
}
