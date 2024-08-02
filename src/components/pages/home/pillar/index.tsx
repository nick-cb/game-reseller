import CollectionActions, { GameItem } from '@/+actions/collections-actions';
import { ButtonLink } from '@/components/Buttons';
import { MoneyFormatter } from '@/components/MoneyFormatter';
import { Text } from '@/components/Typography';
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
        <Text className="translate-x-2" size="lg">
          {data.name[0].toUpperCase() + data.name.slice(1)}
        </Text>
        <ButtonLink
          href={'/browse?collection=' + data.collection_key}
          variant="secondary"
          size="xs"
        >
          VIEW MORE
        </ButtonLink>
      </div>
      <div
        id={'pillar-' + data.collection_key}
        className="scrollbar-hidden cols-min-80 grid snap-x snap-mandatory grid-cols-2 flex-col gap-2 overflow-scroll md:flex"
      >
        <div className="col-start-3 row-start-1 row-end-3 w-56 md:hidden"></div>
        {data.game_list.slice(0, 6).map((game, index) => (
          <Link
            key={game.ID}
            href={`/${game.slug}`}
            style={{
              gridColumnStart: Math.ceil((index + 1) / 3),
              gridRowStart: (index + 1) % 3 === 0 ? 3 : (index + 1) % 3,
            }}
          >
            <div className="flex snap-start items-center gap-4 rounded px-2 py-2 transition-colors hover:bg-paper_2">
              <div className="relative h-24 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={game.images.portraits[0]?.url + '?h=128&w=96&quality=medium&resize=1'}
                  alt=""
                  width={96}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <Text className="mb-2">{game.name}</Text>
                <Text>
                  <MoneyFormatter amount={game.sale_price} />
                </Text>
              </div>
            </div>
          </Link>
        ))}
        {/* Add this column which span 3 row to allow the last one scroll to the start */}
        <div className="col-start-3 row-start-1 row-end-3 w-56 md:hidden"></div>
      </div>
      {/* <div className="pointer-events-none absolute -right-2 bottom-0 h-[calc(100%-28px)] w-80 bg-gradient-to-l from-default md:hidden"></div> */}
    </div>
  );
}
