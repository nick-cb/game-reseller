"use client";

import { Game } from "@/database/models/model";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { flushSync } from "react-dom";
import { SnackContext } from "../../SnackContext";

export type CartContextProps = {
  updating: boolean;
  gameList: (Pick<Game, "ID" | "sale_price"> & { checked: boolean })[];
  changeSelectGame: (
    game: Pick<Game, "ID" | "sale_price"> & { checked: boolean },
    options?: { toggle: boolean },
  ) => Promise<void>;
};
const cartContext = createContext<CartContextProps>({
  updating: false,
  gameList: [],
  changeSelectGame: async () => {},
});

export function CartContext({
  children,
  gameList = [],
  toggleCheck,
}: PropsWithChildren<{
  gameList?: CartContextProps["gameList"];
  toggleCheck: (game: Pick<Game, "ID">) => Promise<string | undefined>;
}>) {
  const [updating, setUpdating] = useState(false);
  const [list, setList] = useState<CartContextProps["gameList"]>(gameList);
  const { showMessage } = useContext(SnackContext);

  async function changeSelectGame(
    game: CartContextProps["gameList"][number],
    options?: { toggle: boolean },
  ) {
    flushSync(() => {
      setUpdating(true);
    });
    const { toggle } = options || { toggle: true };
    const exist = list.findIndex((s) => s.ID === game.ID);
    if (exist !== -1) {
      const item = list[exist];
      const response = await toggleCheck({ ID: item.ID });
      if (response) {
        showMessage({ message: response, type: "error" });
      }
      if (toggle) {
        list[exist] = {
          ...list[exist],
          checked: response ? item.checked : !item.checked,
        };
        setList([...list]);
        setUpdating(false);
      }
    }
  }

  return (
    <cartContext.Provider
      value={{ updating, gameList: list, changeSelectGame }}
    >
      {children}
    </cartContext.Provider>
  );
}

export function useCartContext() {
  const value = useContext(cartContext);

  return value;
}
