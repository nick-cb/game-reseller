'use server';

import { Collections, Game, GameImages, Videos } from '@/database/models/model';
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
  const { names } = params;

  try {
    const { data } = await Q.getCategoryRows({ names });

    return buildArrayCollectionResponse({ collections: data });
  } catch (error) {
    console.error('Error in GameService.getCategoryRow', error);
    return buildArrayCollectionResponse({ collections: [], error });
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

export async function getPillarGroup() {

}


export type GameItem = Pick<
  Game,
  'ID' | 'name' | 'slug' | 'developer' | 'avg_rating' | 'sale_price' | 'description'
> & {
  images: GameImages[];
  videos: Videos[];
};
type BuildSingleResponseParams = {
  collection: Partial<Collections> | undefined | null;
  game_list: GameItem[] | undefined | null;
  error: unknown;
};
function buildSingleCollectionResponse(params: BuildSingleResponseParams) {
  const { collection, game_list, error } = params;
  return {
    data: {
      ID: collection?.ID ?? -1,
      name: collection?.name ?? '',
      collection_key: collection?.collection_key ?? '',
      game_list: game_list ?? [],
    },
    error: (error as unknown) ?? null,
  };
}
type BuildArrayResponseParams = {
  collections: Partial<Collections & { game_list: GameItem[] }>[];
  error?: unknown;
};
function buildArrayCollectionResponse(params: BuildArrayResponseParams) {
  const { collections = [], error } = params;
  const data = collections.map((c) => {
    const { data } = buildSingleCollectionResponse({
      collection: c,
      game_list: c.game_list,
      error: null,
    });

    return data;
  });

  return {
    data: data,
    error: (error as unknown) ?? null,
  };
}
