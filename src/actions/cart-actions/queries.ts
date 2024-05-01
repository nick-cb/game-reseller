'use server';

import { querySingle, sql } from '@/database';
import { Carts, Game, GameImageGroup } from '@/database/models/model';
import { groupImageByType } from '../share/images';

export type UserCart = Carts & {
  game_list: (Pick<
    Game,
    'ID' | 'name' | 'type' | 'developer' | 'publisher' | 'sale_price' | 'slug'
  > & { game_id: number; images: GameImageGroup; checked: boolean })[];
};
type GetUserCartParams = {
  user: { user_id: number };
};
export async function getUserCart(params: GetUserCartParams) {
  const { user } = params;
  const userId = user.user_id;

  return await querySingle<UserCart>(sql`
    select c.ID,
       c.user_id,
       (select json_arrayagg(
                   json_object(
                       'ID', cd.ID,
                       'game_id', g.ID,
                       'name', g.name,
                       'slug', g.slug,
                       'type', g.type,
                       'sale_price', g.sale_price,
                       'developer', g.developer,
                       'publisher', g.publisher,
                       'avg_rating', g.avg_rating,
                       'checked', cd.checked,
                       'images', json_object(
                          'portraits', (${groupImageByType('portrait', true)}),
                          'landscapes', (${groupImageByType('landscape')}),
                          'logos', json_array()
                       )
                   )
               )
        from cart_details cd
               left join games g on g.ID = cd.game_id
        where cd.cart_id = c.ID) as game_list
    from carts c
    where c.user_id = ${userId};
  `);
}

type ToggleItemCheckedParams = {
  cart: { ID: number };
  game: { ID: number };
};
export async function toggleItemChecked(params: ToggleItemCheckedParams) {
  const { cart, game } = params;
  const cartId = cart.ID;
  const gameId = game.ID;
  return querySingle(sql`
    update cart_details set checked = !checked where cart_id = ${cartId} and game_id = ${gameId}
  `);
}
