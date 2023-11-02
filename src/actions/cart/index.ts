"use server";

import { insertSingle, query, querySingle, sql } from "@/database";
import { CartFull, Carts, Game, Users } from "@/database/models";
import { cookies } from "next/headers";
import { decodeToken, getUserFromCookie } from "@/actions/users";
import jwt from "jsonwebtoken";

export async function addItemToCart(slug: string) {
  const cookie = cookies().get("refresh_token");
  if (!cookie) {
    return { data: null };
  }
  const payload = decodeToken(cookie.value);
  if (typeof payload === "string") {
    return { data: null };
  }

  const { data: game } = await querySingle<Game>(sql`
    select * from games where slug = ${slug};
  `);
  if (!game) {
    return { error: "Request item not found" };
  }
  const { data: user } = await querySingle<Users>(sql`
    select * from users where ID = ${payload.userId};
  `);
  if (!user) {
    return { error: "User not found" };
  }
  if (!user.refresh_token) {
    return { data: null };
  }
  jwt.verify(user.refresh_token, process.env.JWT_SECRET!);
  let { data: cart } = await querySingle<Carts>(sql`
    select * from carts where user_id = ${user.ID};
  `);

  if (!cart) {
    const { data: newCart } = await insertSingle(sql`
      insert into carts (user_id) values (${user.ID});
    `);
    const { data: existCart } = await querySingle<Carts>(sql`
      select * from carts where id = ${newCart.insertId};
    `);
    cart = existCart;
  }

  try {
    await insertSingle(sql`
    insert into cart_details (cart_id, game_id, checked) values (${cart!.ID}, ${
      game.ID
    }, ${true});
  `);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Duplicate entry")) {
        return {
          error: "Item already in cart",
          data: null,
        };
      }
      return {
        error: "unkown error",
        data: null,
      };
    }
  }

  return {
    data: cart as Carts,
  };
}

export async function getFullCartByUserId(userId: number) {
  const { data: cart } = await querySingle<Carts>(sql`
    select ID from carts where user_id = ${userId};
  `);
  if (!cart) {
    return {
      data: null,
    };
  }
  return querySingle<CartFull>(sql`
    select ID, user_id, game_list
    from carts
             join (select cart_id,
                          json_arrayagg(json_object('ID', games.ID, 'name', games.name, 'type', games.type, 'developer',
                                                    games.developer,
                                                    'publisher', games.publisher, 'sale_price', games.sale_price,
                                                    'slug', games.slug, 'images', images, 'checked', checked)) as game_list
                   from cart_details
                            join (select games.*,
                                         json_arrayagg(json_object('ID', game_images.ID, 'type', game_images.type, 'alt',
                                                                   game_images.alt,
                                                                   'game_id', game_images.game_id, 'pos_row',
                                                                   game_images.pos_row,
                                                                   'url', game_images.url, 'colors', game_images.colors)) as images
                                  from games
                                           join game_images on games.ID = game_images.game_id
                                  group by games.ID) games
                                 on cart_details.game_id = games.ID
                   group by cart_id) cd on carts.ID = cd.cart_id
    where carts.ID = ${cart.ID};
  `);
}

export async function countCartByUserId(userId: number) {
  const { data: cart } = await querySingle<Carts>(sql`
    select ID from carts where user_id = ${userId};
  `);
  if (!cart) {
    return { data: { count: 0 } };
  }
  return (await querySingle<{ count: number }>(sql`
    select count(*) as count from cart_details where cart_id = ${cart.ID};
  `)) as {
    data: {
      count: number;
    };
  };
}

export async function findUserCart(userId: number) {
  return await querySingle<Carts>(sql`
    select ID from carts where user_id = ${userId};
  `);
}

export async function removeItemFromCart({
  gameId,
  cartId,
}: {
  gameId: number;
  cartId: number;
}) {
  try {
    await querySingle(sql`
      delete from cart_details where cart_id = ${cartId} and game_id = ${gameId}
    `);
    return { data: null };
  } catch (error) {
    return {
      error: "something went wrong",
    };
  }
}

export async function toggleItemChecked({
  gameId,
  checked,
}: {
  gameId: number;
  checked: boolean;
}) {
  const payload = await getUserFromCookie();
  if (!payload) {
    throw Error("UnAuthorized");
  }
  const { data: cart } = await findUserCart(payload.userId);
  try {
    if (!cart) {
      throw new Error();
    }
    await querySingle(sql`
      update cart_details set checked=${checked} where cart_id = ${cart.ID} and game_id = ${gameId}
    `);
    return { data: null };
  } catch (error) {
    return {
      error: "something went wrong",
    };
  }
}

export async function deleteCart(cartId: number) {
  try {
    await Promise.all([
      query(sql`
        delete from cart_details where cart_id = ${cartId};
      `),
    ]);
  } catch (error) {
    return {
      error: "something went wrong",
    };
  }

  return { data: null };
}
