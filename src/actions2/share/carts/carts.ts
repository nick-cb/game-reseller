'use server';

import { Carts } from '@/database/models/model';
import * as Q from './queries';

export async function deleteCartByID(ID: number) {
  try {
    await Q.deleteCartByID(ID);

    return buildSingleResponse({ data: {} });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type BuildSingleResponseParams = {
  data?: Partial<Carts>;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { data, error } = params;
  return {
    data: {
      ID: data?.ID ?? -1,
      user_id: data?.user_id ?? -1,
      // @ts-ignore
      game_list: data?.game_list ?? [],
    },
    error: error instanceof Error ? error.message : error,
  };
}
