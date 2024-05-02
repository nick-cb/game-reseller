import CartActions from '@/actions/cart-actions';
import UserActions from '@/actions/users-actions';
import Link from 'next/link';

export async function CartButton() {
  const user = await UserActions.users.getUserInfoInCookie();
  if (!user) {
    return null;
  }
  const { count } = await CartActions.carts.countItemsInCartByUserID(user.ID);

  return (
    <Link
      href={'/cart'}
      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/25 transition-all hover:scale-110"
    >
      {count ? (
        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#666666] text-xs outline outline-2 outline-paper">
          {count}
        </div>
      ) : null}
      <svg width={20} height={20} fill="white">
        <use
          width={20}
          height={20}
          xlinkHref="/svg/sprites/actions.svg#cart"
          stroke="white"
          fill="white"
        />
      </svg>
    </Link>
  );
}
