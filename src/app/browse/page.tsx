import React from 'react';
import PortraitGameCard from '@/components/PortraitGameCard';
import { z } from 'zod';
import Pagination from '@/components/Pagination';
import GameActions from '@/actions/games-actions';

type PageProps = {
  searchParams: { [K in string]: string | string[] | undefined };
};
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
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 3/4sm:grid-cols-3 lg:grid-cols-4">
      {data.length ? (
        data.map((game: any) => (
          <PortraitGameCard key={game.ID} game={game} className="block snap-start" />
        ))
      ) : (
        <div>No game found</div>
      )}
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
