'use server';

import * as Q from './queries';
import fs from 'fs';

type GetGameListParams = {
  limit: number;
  skip: number;
  tags: string[];
  keyword: string;
  collection: string;
};
export async function getGameList(params: GetGameListParams) {
  const { limit, skip } = params;
  fs.readFileSync('./abc.txt');

  try {
    const { data, total } = await Q.getGameList(params);

    return buildArrayResponse({ games: data, page: skip / limit + 1, limit, total });
  } catch (error) {
    console.error('getGameList', error);
    return buildArrayResponse({ games: [], error });
  }
}

type GameItem = Pick<
  Game,
  'ID' | 'name' | 'slug' | 'developer' | 'avg_rating' | 'sale_price' | 'description'
> & {
  images: GameImageGroup;
};
type BuildSingleResponseParams = {
  game: Partial<GameItem>;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { game, error } = params;

  return {
    data: {
      ID: game.ID ?? -1,
      name: game.name ?? '',
      slug: game.slug ?? '',
      developer: game.developer ?? '',
      avg_rating: game.avg_rating ?? 0,
      sale_price: game.sale_price ?? 0,
      description: game.description ?? '',
      images: game.images ?? { portraits: [], landscapes: [], logos: [] },
    },
    error: error instanceof Error ? error : null,
  };
}

type BuildArrayResponseParams = {
  games: Partial<GameItem>[];
  page?: number;
  limit?: number;
  total?: number;
  error?: unknown;
};
function buildArrayResponse(params: BuildArrayResponseParams) {
  const { games = [], page, limit, total, error } = params;
  const data = games.map((g) => {
    const { data } = buildSingleResponse({ game: g });

    return data;
  });

  return {
    data: data,
    page: page ?? 1,
    limit: limit ?? 0,
    total: total ?? 0,
    error: error instanceof Error ? error : null,
  };
}
