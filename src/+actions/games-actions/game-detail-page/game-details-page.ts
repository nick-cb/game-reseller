'use server';

import { DefaultPagination, isUndefined } from '@/utils';
import { FindBySlugResult } from './queries';
import * as Q from './queries';

type FindBySlugParams = {
  slug: string;
};
export async function findBySlug(params: FindBySlugParams) {
  try {
    const { data } = await Q.findBySlug(params);
    return buildGameItem({ game: data ?? {} });
  } catch (error) {
    return buildGameItem({ game: {}, error });
  }
}

export async function findMappingGroupByID(ID: number) {
  try {
    const { data } = await Q.findMappingByID(ID);
    return buildMappingGroup({ data });
  } catch (error) {
    return buildMappingGroup({ data: [], error });
  }
}

export async function hasMapping(slug: string) {
  try {
    const { data } = await Q.hasMapping(slug);
    return !!data?.data ?? false;
  } catch (error) {
    return false;
  }
}

export async function findMappingList(params: Q.FindMappingListByIndexedInfoParams) {
  const { base_game_id, base_game_slug, pagination } = params || {};
  try {
    if (!base_game_id && !base_game_slug) {
      return buildGameItemArray({ error: 'Missing indexed params' });
    }

    const { data, total } = await Q.findMappingListByIndexedInfo(params);
    return buildGameItemArray({ data, pagination, total });
  } catch (error) {
    return buildGameItemArray({ error });
  }
}

export type GameResponse = ReturnType<typeof buildGameItem>['data'];
type BuildGameItemParams = {
  game: Partial<FindBySlugResult>;
  error?: unknown;
};
function buildGameItem(params: BuildGameItemParams) {
  const { game, error } = params;

  return {
    data: {
      ID: game.ID ?? -1,
      name: !isUndefined(game.name) ? game.name : '',
      slug: !isUndefined(game.slug) ? game.slug : '',
      type: (!isUndefined(game.type) ? game.type : '') as Game['type'],
      base_game_id: !isUndefined(game.base_game_id) ? game.base_game_id : -1,
      base_game_slug: !isUndefined(game.base_game_slug) ? game.base_game_slug : '',
      developer: !isUndefined(game.developer) ? game.developer : '',
      publisher: !isUndefined(game.publisher) ? game.publisher : '',
      release_date: !isUndefined(game.release_date) ? game.release_date : '',
      avg_rating: game.avg_rating ?? 0,
      critic_pct: game.critic_pct ?? 0,
      critic_avg: game.critic_avg ?? 0,
      critic_rec: game.critic_rec ?? 'strong',
      sale_price: !isUndefined(game.sale_price) ? game.sale_price : 0,
      description: !isUndefined(game.description) ? game.description : '',
      long_description: !isUndefined(game.long_description) ? game.long_description : '',
      images: game.images ?? { portraits: [], landscapes: [], logos: [] },
      videos: game.videos ?? [],
      systems: game.systems ?? [],
      tags: game.tags ?? [],
      reviews: game.reviews ?? [],
      polls: game.polls ?? [],
    },
    error: error instanceof Error ? error : null,
  };
}
type BuildGameItemArrayParams = {
  data?: Array<BuildGameItemParams['game']>;
  total?: number;
  error?: unknown;
  pagination?: Q.FindMappingListByIndexedInfoParams['pagination'];
};
function buildGameItemArray(params: BuildGameItemArrayParams) {
  const { data = [], error, pagination = DefaultPagination, total = 0 } = params;

  return {
    data: data.map((item) => buildGameItem({ game: item }).data),
    error: error instanceof Error ? error : null,
    pagination: {...pagination, total},
  };
}

type BuildMappingParams = {
  data: {
    type: string;
    game_list: (Pick<
      Game,
      'ID' | 'name' | 'slug' | 'sale_price' | 'developer' | 'avg_rating' | 'description'
    > & {
      images: GameImageGroup;
    })[];
  }[];
  error?: unknown;
};
function buildMappingGroup(params: BuildMappingParams) {
  const { data, error } = params;
  const mappings = {
    editions: [] as BuildMappingParams['data'][number]['game_list'],
    dlcs: [] as BuildMappingParams['data'][number]['game_list'],
    addons: [] as BuildMappingParams['data'][number]['game_list'],
  };
  for (const { type, game_list } of data) {
    if (type === 'edition') {
      mappings.editions = game_list;
    }
    if (type === 'dlc') {
      mappings.dlcs = game_list;
    }
    if (type === 'add_on') {
      mappings.addons = game_list;
    }
  }
  return {
    data: mappings,
    error: error instanceof Error ? error : null,
  };
}

type buildMappingArrayParams = {
  data?: Array<BuildMappingParams['data']>;
  page?: number;
  limit?: number;
  total?: number;
  error?: unknown;
};
function buildMappingGroupArray(params: buildMappingArrayParams) {
  const { data = [], error } = params;

  const arr = data
    .map((item) => buildMappingGroup({ data: item }))
    .filter((item) => !item.error)
    .map((item) => item.data);

  return {
    data: arr,
    error: error instanceof Error ? error : null,
  };
}
