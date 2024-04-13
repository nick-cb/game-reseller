import { Game, GameImageGroup } from "@/database/models/model";
import { currencyFormatter } from "@/utils";
import Image from "next/image";

export function MobileGameList({
  gameList,
}: {
  gameList: (Pick<Game, "name" | "developer" | "sale_price"> & {
    images: GameImageGroup;
  })[];
}) {
  return (
    <div className="md:hidden">
      <h2 className="uppercase text-lg mb-4">Order summary</h2>
      <ul className="flex flex-col gap-2">
        {gameList.map((game) => {
          return (
            <li className={"w-full bg-paper rounded px-3 py-2 flex gap-4 "}>
              <Image
                src={game?.images.portrait?.url}
                alt={""}
                width={50}
                height={70}
                className="rounded"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-white_primary text-sm">{game.name}</p>
                  <p className="text-white_primary/60 text-xs">
                    {game.developer}
                  </p>
                </div>
                <p>{currencyFormatter(game.sale_price)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
