'use server';

import 'server-only';
import * as Q from './queries';
import { isUndefined } from '@/utils';

export async function getMinimalInfo(params: Q.GetMinimalInfoParams) {
  try {
    const { data } = await Q.getMinimalInfoBySlug(params);
    return buildSingeItemWithMinimalInfo({ data });
  } catch (error) {
    return buildSingeItemWithMinimalInfo({ error });
  }
}

export async function getGameListWithMinimalInfo(params: Q.GetGameListWithMinimalInfoParams) {
  const { limit, skip } = params;
  try {
    const { data, total } = await Q.getGameListWithMinimalInfo(params);
    return buildArrayItemWithMinimalInfo({ games: data, page: skip / limit + 1, limit, total });
  } catch (error) {
    return buildArrayItemWithMinimalInfo({ games: [], error });
  }
}

type BuildSingleGameParams = {
  data?: Partial<Game>;
  error?: unknown;
};
function buildSingeItemWithMinimalInfo(params: BuildSingleGameParams) {
  const { data, error } = params;
  return {
    data: {
      ID: data?.ID ?? -1,
      name: !isUndefined(data?.name) ? data?.name : '',
      slug: data?.slug ? data?.slug : '',
      type: !isUndefined(data?.type) ? data?.type : '',
      base_game_id: !isUndefined(data?.base_game_id) ? data?.base_game_id : -1,
      base_game_slug: data?.base_game_slug ? data?.base_game_slug : '',
      developer: !isUndefined(data?.developer) ? data?.developer : '',
      publisher: !isUndefined(data?.publisher) ? data?.publisher : '',
      release_date: !isUndefined(data?.release_date) ? data?.release_date : '',
      avg_rating: data?.avg_rating ?? 0,
      critic_pct: data?.critic_pct ?? 0,
      critic_avg: data?.critic_avg ?? 0,
      critic_rec: data?.critic_rec ?? 'strong',
      sale_price: !isUndefined(data?.sale_price) ? data?.sale_price : 0,
      description: !isUndefined(data?.description) ? data?.description : '',
      long_description: !isUndefined(data?.long_description) ? data?.long_description : '',
    },
    error: error instanceof Error ? error : null,
  };
}

type RequiredGameAttributes =
  | 'ID'
  | 'name'
  | 'slug'
  | 'developer'
  | 'avg_rating'
  | 'sale_price'
  | 'description'
  | 'images';
export type GameItem = Pick<GameWithImages, RequiredGameAttributes> & {
  videos: Array<Videos>;
};
type BuildArrayResponseParams = {
  games: Partial<GameItem>[];
  page?: number;
  limit?: number;
  total?: number;
  error?: unknown;
};
function buildArrayItemWithMinimalInfo(params: BuildArrayResponseParams) {
  const { games = [], page, limit, total, error } = params;
  const data = games.map((g) => {
    const { data } = buildSingeItemWithMinimalInfo({ data: g });

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

export async function getGameList(params: Q.GetGameListParams) {
  const { skip, limit } = params;
  try {
    const { data, total } = await Q.getGameList(params);
    return buildGameArrayItem({ data, page: skip / limit + 1, limit: params.limit, total: total });
  } catch (error) {
    return buildGameArrayItem({ data: [], error: error });
  }
}

type BuildGameItemParams = {
  data: Partial<Q.GameRow>;
  error?: unknown;
};
function buildGameItem(params: BuildGameItemParams) {
  const { data, error } = params;
  return {
    data: {
      ID: data?.ID ?? -1,
      name: !isUndefined(data?.name) ? data?.name : '',
      slug: data?.slug ? data?.slug : '',
      type: !isUndefined(data?.type) ? data?.type : '',
      base_game_id: !isUndefined(data?.base_game_id) ? data?.base_game_id : -1,
      base_game_slug: data?.base_game_slug ? data?.base_game_slug : '',
      developer: !isUndefined(data?.developer) ? data?.developer : '',
      publisher: !isUndefined(data?.publisher) ? data?.publisher : '',
      release_date: !isUndefined(data?.release_date) ? data?.release_date : '',
      avg_rating: data?.avg_rating ?? 0,
      critic_pct: data?.critic_pct ?? 0,
      critic_avg: data?.critic_avg ?? 0,
      critic_rec: data?.critic_rec ?? 'strong',
      sale_price: !isUndefined(data?.sale_price) ? data?.sale_price : 0,
      description: !isUndefined(data?.description) ? data?.description : '',
      long_description: !isUndefined(data?.long_description) ? data?.long_description : '',
      images: data?.images ?? { portraits: [], landscapes: [], logos: [] },
    },
    error: error instanceof Error ? error : null,
  };
}

type BuildGameArrayItemParams = {
  data: Partial<GameItem>[];
  page?: number;
  limit?: number;
  total?: number;
  error?: unknown;
};
function buildGameArrayItem(params: BuildGameArrayItemParams) {
  const { data = [], page, limit, total, error } = params;
  const newData = data.map((g) => {
    const { data } = buildGameItem({ data: g });

    return data;
  });

  return {
    data: newData,
    page: page ?? 1,
    limit: limit ?? 0,
    total: total ?? 0,
    error: error instanceof Error ? error : null,
  };
}
