import GameActions from '@/+actions/games-actions';
import { MoneyFormatter } from '@/components/MoneyFormatter';
import Pagination from '@/components/Pagination';
import { Text } from '@/components/Typography';
import { GameNav } from '@/components/pages/game/GameNav';
import { mergeCls } from '@/utils';
import Link from 'next/link';
import { z } from 'zod';

type AddOnPageProps = {
  params: Record<string, string>;
  searchParams: Record<string, string>;
};
export default async function AddOnPage({ params, searchParams }: AddOnPageProps) {
  const { slug } = params;
  const keyword = z.string().catch('').parse(searchParams.keyword);
  const page = z.coerce.number().int().catch(1).parse(searchParams.page);
  const { data: game, error } = await GameActions.games.getMinimalInfo({ slug });
  if (error) {
    // TODO: Handle error
    return null;
  }
  const limit = 16;
  const skip = limit * (page - 1);
  const { data, pagination } = await GameActions.gameDetailPage.findMappingList({
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 3/4sm:grid-cols-3 lg:grid-cols-5">
        {data.map((game) => {
          return (
            <div
              key={game.ID}
              className="group row-span-4 grid snap-start grid-rows-subgrid gap-y-2"
            >
              <Link href={`/${game.slug}`} className="contents">
                <div
                  className={mergeCls(
                    'relative h-20 overflow-hidden rounded sm:h-full',
                    'after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity group-hover:after:opacity-[0.1]'
                  )}
                >
                  <img
                    src={game.images.portraits[0].url + '?h=480&w=360&resize=1'}
                    className="relative hidden w-full h-full sm:block"
                  />
                  <img
                    src={game.images.landscapes[0].url + '?h=168&w=168&resize=1'}
                    className="relative w-full h-full object-cover sm:hidden"
                  />
                </div>
                <Text className="line-clamp-2">{game.name}</Text>
                <Text className="hidden truncate sm:block" size="xs" dim>
                  {game.developer}
                </Text>
                <Text>
                  <MoneyFormatter amount={game.sale_price} />
                </Text>
              </Link>
            </div>
          );
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
