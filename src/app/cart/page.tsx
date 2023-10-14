import { getUserFromCookie } from "@/actions/users";
import { redirect } from "next/navigation";
import Image from "next/image";
import { groupImages } from "@/utils/data";
import { currencyFormatter, pascalCase } from "@/utils";
import { getFullCartByUserId } from "@/actions/cart";
import StandardButton from "@/components/StandardButton";
import { RemoveItemBtn } from "@/components/cart/RemoveItemBtn";
import { ItemCheckBox } from "../../components/cart/ItemCheckedBox";
import { CartContext } from "@/components/cart/CartContext";
import { CartTotal } from "@/components/cart/CartTotal";

export default async function cartPage() {
  const user = await getUserFromCookie();
  if (!user) {
    redirect("/");
  }
  const { data: cart } = await getFullCartByUserId(user.userId);
  if (!cart || cart.game_list.length === 0) {
    redirect("/");
  }
  const grouppedImageCart = {
    ...cart,
    game_list: cart.game_list.map((game) => {
      return {
        ...game,
        images: groupImages(game.images),
      };
    }),
  };
  let totalPrice = 0;
  for (const game of cart.game_list) {
    totalPrice += game.sale_price;
  }

  return (
    <CartContext>
      <div className="flex gap-8 xl:gap-16 relative">
        <div className="w-[65%]">
          <h2 className="text-xl pb-4">My cart</h2>
          <ul className="flex flex-col gap-4">
            {grouppedImageCart.game_list.map((item) => {
              return (
                <li
                  className={
                    "bg-paper_2 rounded px-4 py-4 flex gap-8 shadow-sm shadow-black/25 relative group "
                  }
                  key={item.ID}
                >
                  <ItemCheckBox item={item} />
                  <Image
                    src={item.images.portrait.url || ""}
                    alt={""}
                    width={130}
                    height={200}
                    className="rounded"
                  />
                  <div className="flex-grow flex flex-col text-sm">
                    <div className="text-xs px-2 py-1 rounded w-max bg-white_primary/[.15] uppercase shadow-sm shadow-default">
                      {pascalCase(item.type, "_")}
                    </div>
                    <div className="flex justify-between mt-2 mb-1">
                      <p className="font-bold block text-base">{item.name}</p>
                      <p className="block">
                        {item.sale_price === 0
                          ? "Free"
                          : currencyFormatter(item.sale_price)}
                      </p>
                    </div>
                    <p className="text-white_primary/60 text-xs">
                      {item.developer}
                    </p>
                    <div className="mt-auto w-full flex justify-end gap-4">
                      <button className="block hover:text-white_primary w-36 py-2 rounded hover:bg-paper transition-colors hover:shadow-default/25 shadow-sm text-white_primary/60 outline outline-1">
                        Move to wishlist
                      </button>
                      <RemoveItemBtn cart={cart} game={item} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-[30%] sticky top-16 h-max">
          <h2 className="text-xl pb-4">Price summary</h2>
          <div className="flex flex-col gap-8 outline outline-1 outline-white_primary/60 rounded px-8 py-6 shadow-md shadow-black/60">
            <CartTotal />
          </div>
          <StandardButton className="mt-8">Go to checkout</StandardButton>
        </div>
      </div>
    </CartContext>
  );
}
