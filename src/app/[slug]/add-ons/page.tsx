import { findGameBySlug, getGameAddons } from "@/actions/game/select";
import Pagination from "@/components/Pagination";
import PortraitGameCard from "@/components/PortraitGameCard";
import { GameNav } from "@/components/game/GameNav";
import { groupImages } from "@/utils/data";
import { redirect } from "next/navigation";

export default async function AddOnPage({
  params,
  searchParams,
}: {
  params: Record<string, string>;
  searchParams: Record<string, string>;
}) {
  const { slug } = params;
  const { keyword, page } = searchParams;
  const { data: game } = await findGameBySlug(slug);
  if (!game) {
    redirect("/");
  }
  let limit = 16;
  let skip = 0;
  if (page && !isNaN(parseInt(page.toString()))) {
    const _skip = parseInt(page.toString());
    if (_skip > 0) {
      skip = _skip - 1;
    }
  }
  const { data, count: total } = await getGameAddons({
    gameId: game.base_game_id || game.ID,
    limit,
    skip: skip * 16,
    keyword,
  });

  const gameList = data.map((game) => {
    return {
      ...game,
      images: groupImages(game.images),
    };
  });

  return (
    <div className="pt-6">
      <h1 className="text-white_primary pb-6">
        <span className="text-sm mb-1 block">{game.name}</span>
        <span className="text-2xl block">DLC & Add-Ons</span>
      </h1>
      <div className="mb-6">
        <GameNav type={"add-ons"} slug={game.base_game_slug || game.slug} />
      </div>
      <div className="grid grid-cols-2 3/4sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8 ">
        {/* {gameList.map((game) => { */}
        {/*   return ( */}
        {/*     <PortraitGameCard */}
        {/*       key={game.ID} */}
        {/*       game={game} */}
        {/*       className="snap-start block" */}
        {/*     /> */}
        {/*   ); */}
        {/* })} */}
        {total / 32 > 1 ? (
          <Pagination
            total={Math.ceil(total / 32)}
            // @ts-ignore
            currentPage={parseInt(page?.toString())}
            perPage={limit}
            className="col-start-1 col-end-3 3/4sm:col-end-4 lg:col-end-5"
          />
        ) : null}
      </div>
    </div>
  );
}
