"use client";

import { useParams, useRouter } from "next/navigation";
import { getLoggedInStatus } from "@/actions/users";
import { Game } from "@/database/models/model";
import { addItemToCart } from "@/actions/cart";
import { useContext, useTransition } from "react";
import { SnackContext } from "../SnackContext";
import { LoadingIcon } from "../loading/LoadingIcon";

export function AddToCartButton({ game }: { game: Pick<Game, "ID" | "slug" | "name"> }) {
  const router = useRouter();
  const params = useParams();
  const { showMessage } = useContext(SnackContext);
  const [adding, startAddToCart] = useTransition();

  return (
    <button
      className="text-sm py-2 w-full rounded border
                border-white/60 text-white hover:bg-paper transition-colors"
      onClick={async () => {
        const isLogin = await getLoggedInStatus();
        if (!isLogin) {
          router.push(`/login?type=modal&order=${game.slug}`);
          return;
        }
        startAddToCart(async () => {
          if (typeof params["slug"] !== "string") {
            return;
          }
          const { error } = await addItemToCart(params["slug"]);
          router.refresh();
          if (error) {
            return showMessage({ message: error, type: "error" });
          }
          return showMessage({ message: "Added " + game.name + " to cart", type: "success" });
        });
      }}
    >
      <div className="mx-auto w-max">
        <LoadingIcon loading={adding} />
      </div>
      {!adding ? <span>Add to cart</span> : null}
    </button>
  );
}
