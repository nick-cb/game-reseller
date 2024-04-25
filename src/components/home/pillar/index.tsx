import Link from 'next/link';
import { Collections, Game, GameImageGroup } from '@/database/models/model';
import { FVideoFullInfo } from '@/actions/game/select';
import { currencyFormatter } from '@/utils';
import { getCollectionByKey } from '@/actions/collections/collection';
import React from 'react';
import { groupImages } from '@/utils/data';
import HomeActions from '@/actions2/home-actions';

type PillarGame = Pick<
  Game,
  'ID' | 'name' | 'slug' | 'developer' | 'avg_rating' | 'sale_price' | 'description'
> & {
  images: GameImageGroup;
  videos: FVideoFullInfo[];
};
type PillarProps = {
  data: Collections & {
    list_game: PillarGame[];
  };
};

export async function PillarGroup({ names }: { names: string[] }) {
  const { data: pillars } = await HomeActions.collections.getPillarGroup({ names });

  return (
    <>
      {pillars.map((collection) => {
        if (!collection) {
          return null;
        }
        return (
          <React.Fragment key={collection.ID}>
            <Pillar
              data={{
                ...collection,
                list_game: collection.game_list.map((game) => {
                  return {
                    ...game,
                    images: groupImages(game.images),
                  };
                }) as any,
              }}
            />
            <hr className="my-4 border-default last-of-type:hidden md:hidden" />
          </React.Fragment>
        );
      })}
    </>
  );
}

export function Pillar({ data }: PillarProps) {
  return (
    <div className="relative w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="translate-x-2 text-xl">{data.name[0].toUpperCase() + data.name.slice(1)}</h2>
        <Link
          href={'/browse?collection=' + data.collection_key}
          className="rounded border border-white/60 px-2 py-1 text-[10px] text-white_primary/60 transition-colors hover:text-white_primary lg:px-4 lg:py-2 lg:text-xs"
        >
          VIEW MORE
        </Link>
      </div>
      <div
        id={'pillar-' + data.collection_key}
        className="scrollbar-hidden cols-min-80 grid snap-x
        snap-mandatory grid-cols-2 flex-col gap-2
        overflow-scroll md:flex"
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
              className="flex snap-start items-center gap-4 rounded
              px-2 py-2 transition-colors hover:bg-paper_2"
            >
              <div className="relative aspect-[3/4] h-28 overflow-hidden rounded md:h-18">
                <img
                  src={game.images.portraits?.url + '?h=128&w=96&quality=medium&resize=1'}
                  alt=""
                  width={96}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="mb-2 text-sm">{game.name}</p>
                <p className="text-sm text-white/60">
                  {game.sale_price === 0 ? 'Free' : currencyFormatter(game.sale_price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {/* Add this column which span 3 row to allow the last one scroll to the start */}
        <div className="col-start-3 row-start-1 row-end-3 w-56 md:hidden"></div>
      </div>
      <div
        className="pointer-events-none absolute
        -right-2 bottom-0 h-[calc(100%-28px)] w-80 bg-gradient-to-l 
        from-default md:hidden"
      ></div>
    </div>
  );
}
