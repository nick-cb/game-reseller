"use client";

import { Game } from "@/database/models";
import { PropsWithChildren, createContext, useContext, useState } from "react";

export type CartContextProps = {
  selected: Pick<Game, "ID" | "sale_price">[];
  changeSelectGame: (
    game: Pick<Game, "ID" | "sale_price">,
    options?: { toggle: boolean },
  ) => void;
};
const cartContext = createContext<CartContextProps>({
  selected: [],
  changeSelectGame: () => {},
});

export function CartContext({
  children,
  defaultSelected = [],
}: PropsWithChildren<{ defaultSelected?: CartContextProps["selected"] }>) {
  const [selected, setSlected] =
    useState<CartContextProps["selected"]>(defaultSelected);

  function changeSelectGame(
    game: CartContextProps["selected"][number],
    options?: { toggle: boolean },
  ) {
    const { toggle } = options || { toggle: true };
    const exist = selected.findIndex((s) => s.ID === game.ID);
    if (exist !== -1) {
      if (toggle) {
        selected.splice(exist, 1);
        setSlected([...selected]);
      }
      return;
    }
    setSlected((prev) => [...prev, game]);
  }

  return (
    <cartContext.Provider value={{ selected, changeSelectGame }}>
      {children}
    </cartContext.Provider>
  );
}

export function useCartContext() {
  const value = useContext(cartContext);

  return value;
}
