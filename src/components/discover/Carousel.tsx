import React from 'react';
import PortraitGameCard from '../PortraitGameCard';
import Link from 'next/link';
import { CarouselButton } from './Carouse.client';
import { getCollectionByKey2 } from '@/actions/collections';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { groupImages } from '@/utils/data';
import { Icon } from '../Icon';
import { mergeCls } from '@/utils';
import { ScrollItem } from '@/components/scroll2/ScrollPrimitive';

type CarouselProps = {
  name: string;
};

/**
 * @params name: Object
 * */
async function CategoryRow({ name }: CarouselProps) {
  const { data } = await getCollectionByKey2([name]);
  const collection = data[0] || [];

  return (
    <IntersectionObserverContainer>
      <div className={'mb-4 flex justify-between'}>
        <Link
          className="group flex w-max items-center gap-2 pr-4 text-lg text-white"
          href={`/browse?collection=${collection.collection_key}`}
        >
          {collection.name[0].toUpperCase() + collection.name.substring(1)}
          <Icon
            name="arrow-right-s"
            variant="line"
            className="fill-white transition-transform ease-in-out group-hover:translate-x-2"
          />
        </Link>
        <div className={'flex items-center gap-2'}>
          <CarouselButton />
        </div>
      </div>
      <div className="relative">
        <IntersectionObserverRoot>
          <ul
            id={collection.collection_key}
            className="scrollbar-hidden flex snap-x snap-mandatory grid-cols-10 gap-4 overflow-scroll"
          >
            {/* <div style={{ inlineSize: '208px' }} className="shrink-0 xs-right-pad:hidden" /> */}
            {collection.list_game.map((game, index) => (
              <ScrollItem index={index}>
                <PortraitGameCard
                  key={game.ID}
                  game={{ ...game, images: groupImages(game.images) }}
                  className={mergeCls(
                    'w-[calc(calc(100vw_-_32px)/2_-_13px)] flex-shrink-0 snap-start',
                    'last-of-type:snap-end',
                    '3/4sm:w-[calc(calc(100vw_-_32px)/3_-_13px)]',
                    'sm:w-[calc(calc(100vw_-_32px)/4_-_13px)]',
                    'md:w-[calc(calc(100vw_-_32px)/4_-_13px)]',
                    'lg:w-[calc(calc(100vw_-_192px)/5_-_13px)]',
                    'xl:w-[calc(calc(100vw_-_352px)/5_-_13px)]',
                    '2xl:w-[calc(calc(100vw_-_352px)/7_-_13px)]',
                    '4xl:w-[calc(calc(100vw_-_352px)/9_-_13px)]'
                  )}
                />
              </ScrollItem>
            ))}
            <div style={{ inlineSize: '208px' }} className="shrink-0 xs-right-pad:hidden" />
          </ul>
        </IntersectionObserverRoot>
      </div>
    </IntersectionObserverContainer>
  );
}

export default CategoryRow;
