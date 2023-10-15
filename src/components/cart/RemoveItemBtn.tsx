"use client";

import { removeItemFromCart } from "@/actions/cart";
import { Carts, Game } from "@/database/models";
import { useContext, useTransition } from "react";
import { SnackContext } from "../SnackContext";
import { useRouter } from "next/navigation";
import { LoadingIcon } from "../loading/LoadingIcon";
import { useCartContext } from "./CartContext";

export function RemoveItemBtn({
  cart: { ID: cartId },
  game,
}: {
  cart: Pick<Carts, "ID">;
  game: Pick<Game, "ID" | "sale_price">;
}) {
  const { ID: gameId } = game;
  const [removing, startRemove] = useTransition();
  const router = useRouter();
  const { changeSelectGame } = useCartContext();
  const { showMessage } = useContext(SnackContext);

  return (
    <button
      onClick={async () => {
        startRemove(async () => {
          const { error } = await removeItemFromCart({
            cartId,
            gameId,
          });
          if (error) {
            return showMessage({ message: error, type: "error" });
          }
          changeSelectGame(game);
          router.refresh();
        });
      }}
      className={
        "block hover:text-red-400 px-2 py-2 rounded hover:bg-red-200/25 " +
        " transition-colors hover:shadow-default/25 shadow-sm text-white_primary/60 outline outline-1" +
        " w-full md:w-20 "
      }
    >
      <div className="mx-auto w-max">
        <LoadingIcon loading={removing} />
      </div>
      {!removing ? <span>Remove</span> : null}
    </button>
  );
}
