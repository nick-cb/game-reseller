'use server';

import { insertSingle, querySingle, sql } from '@/database';

export async function createCart(params: Partial<Carts>) {
  return insertSingle(sql`
    insert into carts (user_id)
    values (${params.user_id});
  `);
}

export async function deleteCartByID(ID: number) {
  return await querySingle(sql`
    delete from cart_details where cart_id = ${ID};
  `);
}

type InsertItemToCartParams = {
  cart: { ID: number };
  game: { ID: number };
};
export async function inserItemToCart(params: InsertItemToCartParams) {
  return insertSingle(sql`
    insert into cart_details (cart_id, game_id, checked)
    values (${params.cart.ID}, ${params.game.ID}, ${true});
  `);
}

type DeleteCartdetailItemParams = {
  item: { ID: number };
};
export async function deleteCartDetailItem(cartID: number, params: DeleteCartdetailItemParams) {
  const { item } = params;
  return await querySingle(sql`
    delete from cart_details where ID = ${item.ID} and cart_id = ${cartID}
  `);
}

type GetCartMinimalInfoParams = {
  ID?: number;
  user_id?: number;
};
export async function getCartMinimalInfo(params: GetCartMinimalInfoParams) {
  const { ID = 0, user_id = 0 } = params;
  return querySingle<Carts>(sql`
    select c.*
    from carts c
    where if(${!!ID}, c.ID = ${ID}, true)
    and if(${!!user_id}, c.user_id = ${user_id}, true);
  `);
}

export async function countItemsInCartByUserID(userID: number) {
  return querySingle<{ count: number }>(sql`
    select count(*) as count
    from cart_details cd
    join carts c on c.ID = cd.cart_id
    where c.user_id = ${userID};
  `);
}
