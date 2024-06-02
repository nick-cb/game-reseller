import CollectionActions, { GameItem } from '@/+actions/collections-actions';
import { currencyFormatter, mergeCls } from '@/utils';
import Link from 'next/link';
import React from 'react';

export async function PillarGroup({ names }: { names: string[] }) {
  const { data: pillars } = await CollectionActions.homepage.getPillarGroup({ names });

  return (
    <section className="w-[calc(100%_+_8px)] -translate-x-2 gap-8 md:flex">
      {pillars.map((collection) => {
        if (!collection) {
          return null;
        }
        return (
          <React.Fragment key={collection.ID}>
            <Pillar data={collection} />
            <hr className="my-4 border-default last-of-type:hidden md:hidden" />
          </React.Fragment>
        );
      })}
    </section>
  );
}

type PillarProps = {
  data: Collections & {
    game_list: GameItem[];
  };
};
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
        className={mergeCls(
          'scrollbar-hidden cols-min-80 grid snap-x snap-mandatory grid-cols-2 flex-col gap-2 overflow-scroll md:flex'
        )}
      >
        {data.game_list.slice(0, 6).map((game, index) => (
          <Link
            key={game.ID}
            href={`/${game.slug}`}
            style={{
              gridColumnStart: Math.ceil((index + 1) / 3),
              gridRowStart: (index + 1) % 3 === 0 ? 3 : (index + 1) % 3,
            }}
          >
            <div
              className={mergeCls(
                'flex snap-start items-center gap-4 rounded px-2 py-2 transition-colors hover:bg-paper_2'
              )}
            >
              <div className="relative aspect-[3/4] h-28 overflow-hidden rounded md:h-18">
                <img
                  src={game.images.portraits[0]?.url + '?h=128&w=96&quality=medium&resize=1'}
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
        className={mergeCls(
          'pointer-events-none absolute -right-2 bottom-0 h-[calc(100%-28px)] w-80 bg-gradient-to-l from-default md:hidden'
        )}
      ></div>
    </div>
  );
}
