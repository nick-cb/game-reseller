import Link from "next/link";
import Image from "next/image";

export function Pillar({ data }: { data: any }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl translate-x-2">
          {(data.name[0] as string).toUpperCase() + data.name.slice(1)}
        </h2>
        <Link
          href={"/browse"}
          className="text-xs text-white_primary/60 hover:text-white_primary border border-white/60 px-4 py-2 rounded transition-colors"
        >
          VIEW MORE
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {data.list_game.slice(0, 6).map((game: any) => (
          <Link href={`/${game._id}`}>
            <div
              className="py-2 px-2 rounded hover:bg-paper_2 transition-colors
                  flex items-center gap-4"
            >
              <div className="relative h-18 aspect-[3/4] rounded overflow-hidden">
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
      </div>
    </div>
  );
}
