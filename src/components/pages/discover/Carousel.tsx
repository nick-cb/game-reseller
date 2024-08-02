import React from 'react';
import Link from 'next/link';
import { CarouselButton } from './Carouse.client';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { Icon } from '../../Icon';
import { mergeCls } from '@/utils';
import { ScrollItem } from '@/components/scroll/ScrollPrimitive';
import CollectionActions from '@/+actions/collections-actions';
import { Text } from '@/components/Typography';
import { MoneyFormatter } from '@/components/MoneyFormatter';
import { PlaceholderWrapper } from '@/components/Image';

type CarouselProps = {
  name: string;
};
export async function CategoryRow(props: CarouselProps) {
  const { name } = props;
  const { data } = await CollectionActions.homepage.getCategoryRow({ names: [name] });
  const collection = data[0] || [];

  return (
    <section className="relative pb-8">
      <IntersectionObserverContainer>
        <div className={'mb-4 flex justify-between'}>
          <h2 className="text-lg text-white">
            <Link
              className="group flex w-max items-center gap-2 pr-4"
              href={`/browse?collection=${collection.collection_key}`}
            >
              {collection.name[0].toUpperCase() + collection.name.substring(1)}
              <Icon
                name="arrow-right-s"
                variant="line"
                className="fill-white transition-transform ease-in-out group-hover:translate-x-2"
              />
            </Link>
          </h2>
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
                  key={game.ID}
                  index={index}
                  className="group row-span-4 grid snap-start grid-rows-subgrid gap-y-2"
                  tabIndex={0}
                >
                  <Item game={game} />
                </ScrollItem>
              ))}
            </ul>
          </IntersectionObserverRoot>
        </div>
      </IntersectionObserverContainer>
    </section>
  );
}

type ItemProps = {
  game: Pick<GameWithImages, 'slug' | 'images' | 'name' | 'developer' | 'sale_price'>;
};
function Item(props: ItemProps) {
  const { game } = props;
  return (
    <Link href={`/${game.slug}`} className="contents">
      <PlaceholderWrapper
        className={mergeCls(
          'relative h-20 overflow-hidden rounded sm:h-full',
          'after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity group-hover:after:opacity-[0.1]'
        )}
      >
        <picture>
          <source
            media="(min-width:640px)"
            srcSet={encodeURI(game.images.portraits[0].url) + '?h=480&w=360&resize=1 640w'}
            width={360}
            height={480}
          />
          <img
            src={game.images.landscapes[0].url + '?h=480&w=360&resize=1'}
            width={168}
            height={168}
            className='object-cover h-full'
          />
        </picture>
      </PlaceholderWrapper>
      <Text className="line-clamp-2">{game.name}</Text>
      <Text className="hidden truncate sm:block" size="xs" dim>
        {game.developer}
      </Text>
      <Text>
        <MoneyFormatter amount={game.sale_price} />
      </Text>
    </Link>
  );
}
