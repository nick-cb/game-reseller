import CartActions from '@/+actions/cart-actions';
import UserActions from '@/+actions/users-actions';
import { Button } from '@/components/Buttons';
import { CartContext } from '@/components/pages/cart/CartContext';
import { CartTotal } from '@/components/pages/cart/CartTotal';
import { CheckoutButton } from '@/components/pages/cart/CheckoutButton';
import { ItemCheckBox } from '@/components/pages/cart/ItemCheckedBox';
import { RemoveItemButton } from '@/components/pages/cart/RemoveItemButton';
import { CheckoutView } from '@/components/pages/checkout/Checkout';
import { CheckoutModal } from '@/components/pages/checkout/CheckoutForm';
import { currencyFormatter, pascalCase } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function cartPage() {
  const user = await UserActions.users.getUserInfoInCookie();
  if (!user) {
    redirect('/');
  }
  const { data: cart } = await CartActions.cartPage.getUserCart({ user: { user_id: user.ID } });
  let totalPrice = 0;
  for (const game of cart.game_list) {
    totalPrice += game.sale_price;
  }
  const toggleChecked = async (game: Pick<Game, 'ID'>) => {
    'use server';
    const { error } = await CartActions.cartPage.toggleItemChecked({ game, cart });
    return error?.message;
  };

  if (!cart) {
    return (
      <div>
        <svg className="mx-auto" color="hsl(0, 0%, 20%)">
          <use xlinkHref="/svg/sprites/actions.svg#cart-empty" />
        </svg>
        <br />
        <h2 className="mx-auto block w-max text-xl">Your cart is empty.</h2>
        <br />
        <Link
          href={'/browse'}
          className="mx-auto block w-max text-white_primary/60 underline transition-colors hover:text-white_primary"
        >
          Start shopping now!
        </Link>
      </div>
    );
  }

  return (
    <CartContext toggleCheck={toggleChecked} gameList={cart.game_list}>
      <div className="relative flex flex-col gap-8 md:flex-row xl:gap-16">
        <div className="md:w-[65%]">
          <h2 className="pb-4 text-xl">My cart</h2>
          <ul className="flex flex-col gap-8">
            {cart.game_list.map((item, index) => {
              return (
                <li
                  key={item.ID}
                  className="group relative flex h-max flex-col gap-4 rounded bg-paper_2 px-4 py-4 shadow-sm shadow-black/25 md:flex-row md:gap-8"
                >
                  <Item index={index} item={item} cart={cart} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sticky top-16 h-max md:w-[30%]">
          <h2 className="pb-4 text-xl">Price summary</h2>
          <div className="flex flex-col gap-8 rounded px-8 py-6 shadow-md shadow-black/60 outline outline-1 outline-white_primary/60">
            <CartTotal />
          </div>
          <CheckoutModal SubmitButton={<CheckoutButton />}>
            <Suspense>
              <CheckoutView gameList={cart.game_list} cartId={cart.ID} />
            </Suspense>
          </CheckoutModal>
        </div>
      </div>
    </CartContext>
  );
}

type ItemProps = {
  index: number;
  item: Awaited<ReturnType<typeof CartActions.cartPage.getUserCart>>['data']['game_list'][number];
  cart: Awaited<ReturnType<typeof CartActions.cartPage.getUserCart>>['data'];
};
function Item(props: ItemProps) {
  const { index, cart, item } = props;

  return (
    <>
      <ItemCheckBox index={index} />
      <div className="hidden md:block">
        <Image
          src={item.images.portraits[0].url || ''}
          alt={''}
          width={130}
          height={200}
          className="rounded"
        />
      </div>
      <div className="block md:hidden">
        <Image
          src={item.images.landscapes[0].url || ''}
          alt={''}
          width={300}
          height={200}
          className="h-[100px] w-full rounded object-cover 3/4sm:h-[300px]"
        />
      </div>
      <div className="flex flex-grow flex-col text-sm">
        <div className="w-max rounded bg-white_primary/[.15] px-2 py-1 text-xs uppercase shadow-sm shadow-default">
          {pascalCase(item.type, '_')}
        </div>
        <div className="mb-1 mt-2 flex justify-between">
          <p className="block text-base font-bold">{item.name}</p>
          <p className="block">
            {item.sale_price === 0 ? 'Free' : currencyFormatter(item.sale_price)}
          </p>
        </div>
        <p className="text-xs text-white_primary/60">{item.developer}</p>
        <hr className="my-3 w-[calc(100%+32px)] -translate-x-4 border-white/60 md:hidden" />
        <div className="mx-auto flex w-4/5 gap-4 md:mx-[unset] md:mt-auto md:w-full md:justify-end">
          <Button size="sm" variant="secondary" disabled title="Feature incoming">
            <span className="min-w-28">Move to wishlist</span>
          </Button>
          <RemoveItemButton cart={cart} item={{ ...item }} />
        </div>
      </div>
    </>
  );
}
