'use server';

import * as Q from './queries';

export async function getHeroCarousel() {
  try {
    const { collection, game_list } = await Q.getheroCarousel();
    return buildSingleCollectionResponse({ collection, game_list, error: null });
  } catch (error) {
    console.error('Error in GameService.getHeroCarousel', error);
    return buildSingleCollectionResponse({ collection: null, game_list: null, error: error });
  }
}

type GetCategoryRowParams = {
  names: string[];
};
export async function getCategoryRow(params: GetCategoryRowParams) {
  try {
    const { names } = params;
    const { data } = await Q.getCategoryRows({ names });

    return buildArrayCollectionResponse({ collections: data });
  } catch (error) {
    console.error('Error in GameService.getCategoryRow', error);
    return buildArrayCollectionResponse({ error });
  }
}

export async function getFeatureRow() {
  try {
    const { data } = await Q.getFeatureRow({ name: 'feature' });
    return buildSingleCollectionResponse({
      collection: data,
      game_list: data?.game_list,
      error: null,
    });
  } catch (error) {
    console.error('Error in GameService.getFeatureRow', error);
    return buildSingleCollectionResponse({ collection: null, game_list: null, error });
  }
}

type GetPillarGroupParams = {
  names: string[];
};
export async function getPillarGroup(params: GetPillarGroupParams) {
  try {
    const { data } = await Q.getPillarGroup(params);
    return buildArrayCollectionResponse({ collections: data });
  } catch (error) {
    console.error('Error in GameService.getPillarGroup', error);
    return buildArrayCollectionResponse({ collections: [], error });
  }
}

// ==============================================================================

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
type BuildSingleResponseParams = {
  collection: Partial<Collections> | undefined | null;
  game_list: Array<GameItem> | undefined | null;
  error: unknown;
};
function buildSingleCollectionResponse(params: BuildSingleResponseParams) {
  const { collection, game_list, error } = params;
  if (error) {
    return {
      data: null,
      error: error instanceof Error ? { message: error.message } : { message: 'Unknown error' },
    };
  }
  return {
    data: {
      ID: collection?.ID ?? -1,
      name: collection?.name ?? '--',
      collection_key: collection?.collection_key ?? '--',
      game_list: game_list ?? [],
    },
    error: null,
  };
}

type BuildArrayResponseParams = {
  collections?: Array<Partial<Collections & { game_list: Array<Q.GameItem> }>>;
  error?: unknown;
};
function buildArrayCollectionResponse(params: BuildArrayResponseParams) {
  const { collections = [{ game_list: [] }], error } = params;
  const data = collections.map((c) => {
    const { data } = buildSingleCollectionResponse({
      collection: c,
      game_list: c.game_list,
      error: null,
    });

    return data as NonNullable<ReturnType<typeof buildSingleCollectionResponse>['data']>;
  });

  return {
    data: data,
    error: error instanceof Error ? error : null,
  };
}
