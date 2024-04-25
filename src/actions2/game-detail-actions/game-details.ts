'use server';

import { isUndefined } from '@/utils';
import { FindBySlugResult } from './queries';
import * as Q from './queries';

type FindBySlugParams = {
  slug: string;
};
export async function findBySlug(params: FindBySlugParams) {
  try {
    const { data } = await Q.findBySlug(params);
    return buildSingleResponse({ game: data ?? {} });
  } catch (error) {
    return buildSingleResponse({ game: {}, error });
  }
}

export type GameResponse = ReturnType<typeof buildSingleResponse>['data'];
type BuildSingleResponseParams = {
  game: Partial<FindBySlugResult>;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { game, error } = params;

  return {
    data: {
      ID: game.ID ?? -1,
      name: !isUndefined(game.name) ? game.name : '',
      slug: !isUndefined(game.slug) ? game.slug : '',
      type: !isUndefined(game.type) ? game.type : '',
      base_game_id: !isUndefined(game.base_game_id) ? game.base_game_id : -1,
      base_game_slug: !isUndefined(game.base_game_slug) ? game.base_game_slug : '',
      developer: !isUndefined(game.developer) ? game.developer : '',
      publisher: !isUndefined(game.publisher) ? game.publisher : '',
      release_date: !isUndefined(game.release_date) ? game.release_date : '',
      avg_rating: !isUndefined(game.avg_rating) ? game.avg_rating : 0,
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
