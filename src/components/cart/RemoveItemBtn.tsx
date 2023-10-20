"use client";

import { removeItemFromCart } from "@/actions/cart";
import { Carts, Game } from "@/database/models";
import { useContext, useTransition } from "react";
import { SnackContext } from "../SnackContext";
import { useRouter } from "next/navigation";
import { LoadingIcon } from "../loading/LoadingIcon";

export function RemoveItemBtn({
  cart: { ID: cartId },
  game,
}: {
  cart: Pick<Carts, "ID">;
  game: Pick<Game, "ID" | "sale_price"> & { checked: boolean };
}) {
  const { ID: gameId } = game;
  const [removing, startRemove] = useTransition();
  const router = useRouter();
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
          router.refresh();
        });
      }}
      className={
        "block focus:text-red-400 hover:text-red-400 px-2 py-2 rounded focus:bg-red-200/25 hover:bg-red-200/25 " +
        " transition-colors focus:shadow-default/25 hover:shadow-default/25 shadow-sm text-white_primary/60 outline outline-1 focus:outline-red-400" +
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
