'use server';
import * as Q from './queries';

type GetUserCartParams = {
  user: { user_id: number };
};
export async function getUserCart(params: GetUserCartParams) {
  try {
    const { data } = await Q.getUserCart(params);
    return buildSingleResponse({ data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type ToggleItemCheckedParams = {
  cart: { ID: number };
  game: { ID: number };
};
export async function toggleItemChecked(params: ToggleItemCheckedParams) {
  try {
    await Q.toggleItemChecked(params);
    return buildSingleResponse({});
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type BuildSingleResponseParams = {
  data?: Q.UserCart;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { data, error } = params;

  return {
    data: {
      ID: data?.ID ?? -1,
      user_id: data?.user_id ?? -1,
      game_list: data?.game_list ?? [],
    },
    error: error instanceof Error ? error : null,
  };
}
