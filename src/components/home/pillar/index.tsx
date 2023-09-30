import Link from "next/link";
import Image from "next/image";
import { Collections, Game, GameImageGroup } from "@/database/models";
import { FVideoFullInfo } from "@/database/repository/game/select";

type PillarGame = Pick<
  Game,
  | "ID"
  | "name"
  | "slug"
  | "developer"
  | "avg_rating"
  | "sale_price"
  | "description"
> & {
  images: GameImageGroup;
  videos: FVideoFullInfo[];
};
type PillarProps = {
  data: Collections & {
    list_game: PillarGame[];
  };
};

export function Pillar({ data }: PillarProps) {
  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl translate-x-2">
          {data.name[0].toUpperCase() + data.name.slice(1)}
        </h2>
        <Link
          href={"/browse?collection=" + data.collection_key}
          className="text-[10px] lg:text-xs text-white_primary/60 hover:text-white_primary border border-white/60 px-2 py-1 lg:px-4 lg:py-2 rounded transition-colors"
        >
          VIEW MORE
        </Link>
      </div>
      <div
        id={"pillar-" + data.collection_key}
        className="overflow-scroll grid grid-cols-2 cols-min-80
        md:flex flex-col gap-2 scrollbar-hidden
        snap-x snap-mandatory"
      >
        {data.list_game.slice(0, 6).map((game, index) => (
          <Link
            key={game.ID}
            href={`/${game.slug}`}
            style={{
              gridColumnStart: Math.ceil((index + 1) / 3),
              gridRowStart: (index + 1) % 3 === 0 ? 3 : (index + 1) % 3,
            }}
          >
            <div
              className="py-2 px-2 rounded hover:bg-paper_2 transition-colors
              flex items-center gap-4 snap-start"
            >
              <div className="relative h-28 md:h-18 aspect-[3/4] rounded overflow-hidden">
                <Image src={game.images.portrait?.url} alt="" fill />
              </div>
              <div>
                <p className="mb-2 text-sm">{game.name}</p>
                <p className="text-sm text-white/60">
                  {game.sale_price === 0 ? "Free" : "đ" + game.sale_price}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {/* Add this column which span 3 row to allow the last one scroll to the start */}
        <div className="col-start-3 row-start-1 row-end-3 w-56 md:hidden"></div>
      </div>
      <div
        className="pointer-events-none md:hidden
        absolute bottom-0 h-[calc(100%-28px)] w-80 -right-2 
        bg-gradient-to-l from-default"
      ></div>
    </div>
  );
}
