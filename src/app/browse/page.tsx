import React from 'react';
import { z } from 'zod';
import Pagination from '@/components/Pagination';
import GameActions from '@/+actions/games-actions';
import Link from 'next/link';
import { mergeCls } from '@/utils';
import { Text } from '@/components/Typography';
import Image from 'next/image';
import { Icon } from '@/components/Icon';

const page = async (props: PageProps) => {
  const { searchParams } = props;
  const categories = z
    .string()
    .catch('')
    .transform((value) => value.split(',').filter((v) => v !== ''))
    .parse(searchParams.categories);
  const keyword = z.string().catch('').parse(searchParams.keyword);
  const collection = z.string().catch('').parse(searchParams.collection);
  const page = z.coerce.number().int().catch(1).parse(searchParams.page);
  const limit = 24;
  const skip = limit * (page - 1);

  const { data, error, total } = await GameActions.browsePage.getGameList({
    tags: categories,
    limit,
    skip: skip,
    keyword: keyword,
    collection: collection,
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 3/4sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-4">
      {data.length
        ? data.map((game) => (
            <div key={game.ID} className="group relative snap-start gap-y-2 overflow-hidden rounded">
              <Item game={game} />
            </div>
          ))
        : null}
      {!data.length ? <div>No game found</div> : null}
      {total ? (
        <Pagination
          total={total}
          perPage={limit}
          currentPage={page}
          className="col-start-1 col-end-3 3/4sm:col-end-4 lg:col-end-5"
        />
      ) : null}
    </div>
  );
};

export default page;

type ItemProps = {
  game: Pick<
    GameWithImages,
    'slug' | 'images' | 'name' | 'developer' | 'sale_price' | 'avg_rating'
  >;
};
function Item(props: ItemProps) {
  const { game } = props;
  return (
    <Link href={`/${game.slug}`} className="contents">
      <div
        className={mergeCls(
          'relative h-40 overflow-hidden sm:h-full',
          'after:absolute after:inset-0 after:bg-white after:opacity-0 after:transition-opacity group-hover:after:opacity-[0.1]'
        )}
      >
        <img
          src={game.images.portraits[0].url + '?h=480&w=360&resize=1'}
          className="relative hidden h-full w-full sm:block"
        />
        <img
          src={game.images.landscapes[0].url + '?h=240&w=240&resize=1'}
          className="relative h-full w-full object-cover sm:hidden"
        />
      </div>
      <div className="absolute bottom-0 flex h-1/2 w-full items-end gap-1 bg-gradient-to-t from-paper_3/80 via-paper_3/50 via-40% to-transparent p-1">
        <div className="flex flex-grow flex-col gap-1">
          <Text size="xs" className="font-semibold">
            {game.name}
          </Text>
          <div className="flex items-center gap-1">
            <Icon name="star" size={12} variant="fill" />
            <Text size="xs">{game.avg_rating}</Text>
          </div>
        </div>
        <div
          className={mergeCls(
            'grid h-8 w-8 flex-shrink-0 place-items-center rounded p-1 backdrop-blur-md',
            'shadow-inner shadow-white/10 [--tw-shadow-colored:_inset_0_1px_2px_1px_var(--tw-shadow-color)]'
          )}
          style={{ backgroundColor: `rgba(${game.images.logos?.[0]?.colors?.highestSat}, 0.2)` }}
        >
          <Image
            src={game.images.logos?.[0]?.url}
            width={30}
            height={30}
            alt=""
            className="object-center"
          />
        </div>
      </div>
    </Link>
  );
}
