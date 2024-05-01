'use server';

import { Game } from '@/database/models/model';
import * as Q from './queries';
import { isUndefined } from '@/utils';

export async function getMinimalInfo(params: Q.GetMinimalInfoParams) {
  try {
    const { data } = await Q.getMinimalInfoBySlug(params);
    return buildSingeGame({ data });
  } catch (error) {
    return buildSingeGame({ error });
  }
}

type BuildSingleGameParams = {
  data?: Partial<Game>;
  error?: unknown;
};
function buildSingeGame(params: BuildSingleGameParams) {
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
