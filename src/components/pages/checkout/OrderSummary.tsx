import { currencyFormatter } from "@/utils";
import Image from "next/image";

export function OrderSummary({
  gameList,
  totalAmount,
}: {
  totalAmount: number;
  gameList: (Pick<Game, "ID" | "name" | "sale_price" | "developer"> & {
    images: GameImageGroup;
  })[];
}) {
  return (
    <div>
      <h2 className="uppercase text-lg mb-4">Order summary</h2>
      <ul className="flex flex-col gap-4 max-h-[430px] overflow-scroll scrollbar-hidden">
        {gameList.map((game) => {
          return (
            <li key={game.ID} className={"flex gap-4"}>
              <Image
                src={game?.images.portraits[0]?.url}
                alt={""}
                width={128}
                height={280}
                className="rounded object-cover"
              />
              <div className="flex flex-col">
                <p className="font-bold text-white_primary">{game.name}</p>
                <p className="text-white_primary/60 text-sm">
                  {game.developer}
                </p>
                <p className="mt-4 block text-sm">
                  {currencyFormatter(game.sale_price)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <hr className="border-white_primary/60 my-8" />
      <div className="flex justify-between items-center">
        <div>Total</div>
        <div>{currencyFormatter(totalAmount)}</div>
      </div>
    </div>
  );
}
