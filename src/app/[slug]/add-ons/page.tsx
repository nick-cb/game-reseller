import GameDetailActions from '@/actions/game-detail-actions';
import ShareActions from '@/actions/share';
import Pagination from '@/components/Pagination';
import PortraitGameCard from '@/components/PortraitGameCard';
import { GameNav } from '@/components/game/GameNav';
import { z } from 'zod';

type AddOnPageProps = {
  params: Record<string, string>;
  searchParams: Record<string, string>;
};
export default async function AddOnPage({ params, searchParams }: AddOnPageProps) {
  const { slug } = params;
  const keyword = z.string().catch('').parse(searchParams.keyword);
  const page = z.coerce.number().int().catch(1).parse(searchParams.page);
  const { data: game, error } = await ShareActions.games.getMinimalInfo({slug});
  if (error) {
    // TODO: Handle error
    return null;
  }
  const limit = 16;
  const skip = limit * (page - 1);
  const { data, pagination } = await GameDetailActions.games.findMappingList({
    base_game_id: game.ID,
    keyword,
    pagination: { limit, skip },
  });
  const { total } = pagination;

  return (
    <div className="pt-6">
      <h1 className="pb-6 text-white_primary">
        <span className="mb-1 block text-sm">{game.name}</span>
        <span className="block text-2xl">DLC & Add-Ons</span>
      </h1>
      <div className="mb-8">
        <GameNav type={'add-ons'} slug={game.base_game_slug || game.slug} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 3/4sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ">
        {data.map((game) => {
          return <PortraitGameCard key={game.ID} game={game} className="block snap-start" />;
        })}
        <Pagination
          total={total}
          perPage={limit}
          currentPage={page}
          className="col-start-1 col-end-3 3/4sm:col-end-4 lg:col-end-5"
        />
      </div>
    </div>
  );
}
