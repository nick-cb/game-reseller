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

export function CartContext({ children }: PropsWithChildren) {
  const [selected, setSlected] = useState<CartContextProps["selected"]>([]);

  function changeSelectGame(
    game: CartContextProps["selected"][number],
    options?: { toggle: boolean },
  ) {
    console.log(game.ID, selected.map(s => s.ID));
    const { toggle } = options || { toggle: true };
    const exist = selected.findIndex((s) => s.ID === game.ID);
    if (exist !== -1) {
      if (toggle) {
        selected.splice(exist, 1);
        setSlected(selected.filter((s) => s.ID !== game.ID));
      }
      return;
    }
    setSlected([...selected, game]);
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
