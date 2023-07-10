import Link from "next/link";
import Image from "next/image";

export function Pillar({ data }: { data: any }) {
  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl lg:text-2xl translate-x-2">
          {(data.name[0] as string).toUpperCase() + data.name.slice(1)}
        </h2>
        <Link
          href={"/browse"}
          className="text-[10px] lg:text-xs text-white_primary/60 hover:text-white_primary border border-white/60 px-2 py-1 lg:px-4 lg:py-2 rounded transition-colors"
        >
          VIEW MORE
        </Link>
      </div>
      <div
        className="overflow-scroll grid grid-cols-2 cols-min-96
        md:flex flex-col gap-2 scrollbar-hidden
        snap-x snap-mandatory"
      >
        {data.list_game.slice(0, 6).map((game: any) => (
          <Link href={`/${game._id}`}>
            <div
              className="py-2 px-2 rounded hover:bg-paper_2 transition-colors
                  flex items-center gap-4 snap-start"
            >
              <div className="relative h-28 md:h-18 aspect-[3/4] rounded overflow-hidden">
                <Image
                  src={game.images.find((i: any) => i.type === "portrait")?.url}
                  alt=""
                  fill
                />
              </div>
              <div>
                <p className="mb-2 text-sm">{game.name}</p>
                <p className="text-sm text-white/60">${game.sale_price}</p>
              </div>
            </div>
          </Link>
        ))}
        {/* Add this column which span 3 row to allow the last one scroll to the start */}
        <div className="col-start-3 row-start-1 row-end-3 w-56 md:hidden"></div>
      </div>
      <div
        className="pointer-events-none z-10 md:hidden
        absolute bottom-0 h-[calc(100%-28px)] w-80 right-0 
        bg-gradient-to-l from-default"
      ></div>
    </div>
  );
}
