'use server';

import { Carts } from '@/database/models/model';
import * as Q from './cartpage/queries';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import GameActions from '../games-actions';
import UserActions from '../users-actions';

export async function deleteCartByID(ID: number) {
  try {
    await Q.deleteCartByID(ID);

    return buildSingleResponse({ data: {} });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type AddToCartParams = {
  game: { ID: number };
};
export async function addItemToCart(params: AddToCartParams) {
  try {
    const { game } = params;
    const cookie = cookies().get('refresh_token');
    if (!cookie) {
      throw new Error('UnAuthorized');
    }
    const payload = await UserActions.users.decodeToken({ token: cookie.value });
    if (typeof payload === 'string') {
      throw new Error('UnAuthorized');
    }

    const { data, error: gameErr } = await GameActions.games.getMinimalInfo({ ID: game.ID });
    if (gameErr) {
      throw new Error(gameErr.message);
    }
    const { data: user, error: userErr } = await UserActions.users.getUserByID(payload.user.ID);
    if (userErr) {
      throw new Error(userErr.message);
    }
    if (!user.refresh_token) {
      throw new Error('UnAuthorized');
    }
    jwt.verify(user.refresh_token, process.env.JWT_SECRET!);
    const { data: cart, error: cartErr } = await upsertCart({ user_id: user.ID });
    if (cartErr) {
      throw new Error(cartErr.message);
    }
    await Q.inserItemToCart({
      cart: { ID: cart.ID },
      game: { ID: data.ID },
    });

    return buildSingleResponse({ data: cart });
  } catch (error) {
    console.log(error);
    return buildSingleResponse({ error });
  }
}
async function upsertCart(params: Partial<Carts>) {
  try {
    const { user_id } = params;
    const { data } = await Q.getCartMinimalInfo({ user_id: user_id });
    if (!data?.ID) {
      const { data } = await Q.createCart({ user_id: user_id });
      return buildSingleResponse({ data: { ID: data.insertId, user_id: user_id } });
    }
    return buildSingleResponse({ data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type RemoveItemFromCartParams = {
  item: { ID: number };
};
export async function removeItemFromCart(cartID: number, params: RemoveItemFromCartParams) {
  try {
    const { item } = params;
    await Q.deleteCartDetailItem(cartID, { item });
    return buildSingleResponse({ data: {} });
  } catch (error) {
    console.log(error);
    return buildSingleResponse({ error });
  }
}

export async function countItemsInCartByUserID(userID: number) {
  try {
    const { data } = await Q.countItemsInCartByUserID(userID);
    return data ?? { count: 0 };
  } catch (error) {
    console.log(error);
    return { count: 0 };
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
    error: error instanceof Error ? { message: error.message } : null,
  };
}
