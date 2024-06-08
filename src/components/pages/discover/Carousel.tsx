import React from 'react';
import PortraitGameCard from '../../PortraitGameCard';
import Link from 'next/link';
import { CarouselButton } from './Carouse.client';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { Icon } from '../../Icon';
import { currencyFormatter, mergeCls } from '@/utils';
import { ScrollItem } from '@/components/scroll/ScrollPrimitive';
import CollectionActions from '@/+actions/collections-actions';

type CarouselProps = {
  name: string;
};

/**
 * @params name: Object
 * */
async function CategoryRow({ name }: CarouselProps) {
  const { data } = await CollectionActions.homepage.getCategoryRow({ names: [name] });
  const collection = data[0] || [];

  return (
    <section className="relative pb-8">
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
              className={mergeCls(
                'scrollbar-hidden home-category-row-grid snap-x snap-mandatory overflow-x-scroll',
                '[--column:3] 3/4sm:[--column:4] sm:[--column:4] md:[--column:5] 2xl:[--column:6]',
                '[--gap:14px] 3/4sm:[--gap:18px] lg:[--gap:24px]'
              )}
            >
              {collection.game_list.map((game, index) => (
                <ScrollItem
                  key={index}
                  index={index}
                  className="group row-span-4 grid snap-start grid-rows-subgrid gap-y-2"
                  tabIndex={0}
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
                        className="relative hidden h-full sm:block"
                      />
                      <img
                        src={game.images.landscapes[0].url + '?h=168&w=168&resize=1'}
                        className="relative h-full object-cover sm:hidden"
                      />
                    </div>
                    <p className="line-clamp-2 text-xs text-white_primary sm:text-sm">
                      {game.name}
                    </p>
                    <p className="hidden truncate text-xs text-white/60 sm:block">
                      {game.developer}
                    </p>
                    <p className="text-xs text-white_primary sm:text-sm">
                      {parseInt(game.sale_price.toString()) === 0
                        ? 'Free'
                        : currencyFormatter(game.sale_price)}
                    </p>
                  </Link>
                </ScrollItem>
              ))}
            </ul>
          </IntersectionObserverRoot>
        </div>
      </IntersectionObserverContainer>
    </section>
  );
}

export default CategoryRow;
