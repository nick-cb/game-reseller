import { countCartByUserId } from "@/actions/cart";
import { getUserFromCookie } from "@/actions/users";
import Link from "next/link";

export async function CartButton() {
  const user = await getUserFromCookie();
  const { count } = user ? await countCartByUserId(user.userId) : { count: 0 };

  if (!user) {
    return null;
  }

  return (
    <Link
      href={"/cart"}
      className="w-8 h-8 rounded-full bg-white/25 flex justify-center items-center transition-all hover:scale-110 relative"
    >
      {count ? (
        <div className="absolute -top-1 -right-1 text-xs w-4 h-4 flex justify-center items-center bg-[#666666] outline-2 outline outline-paper rounded-full">
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
