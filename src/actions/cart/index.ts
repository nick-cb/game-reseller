"use server";

import { connectDB, sql } from "@/database";
import { ResultSetHeader, RowDataPacket } from "mysql2/index";
import { CartFull, Carts, Game, Users } from "@/database/models";
import { cookies } from "next/headers";
import { decodeToken } from "@/actions/users";
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
  const db = await connectDB();

  const gameResponse = await db.execute<(RowDataPacket & Game)[]>(sql`
    select * from games where slug = '${slug}';
  `);

  const game = gameResponse[0][0];
  const userResponse = await db.execute<(RowDataPacket & Users)[]>(sql`
    select * from users where ID = ${payload.userId};
  `);
  const user = userResponse[0][0];
  if (!user.refresh_token) {
    return { data: null };
  }
  jwt.verify(user.refresh_token, process.env.JWT_SECRET!);
  const existCartResponse = await db.execute<(RowDataPacket & Carts)[]>(sql`
    select * from carts where user_id = ${user.ID};
  `);
  let cart = existCartResponse[0][0];

  if (!cart) {
    const newCartResponse = await db.execute<ResultSetHeader>(sql`
      insert into carts (user_id) values (${user.ID});
    `);
    const existCartResponse = await db.execute<(RowDataPacket & Carts)[]>(sql`
      select * from carts where cart_id = ${newCartResponse[0].insertId};
    `);
    cart = existCartResponse[0][0];
  }

  try {
    await db.execute(sql`
    insert into cart_details (cart_id, game_id) values (${cart.ID}, ${game.ID});
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
  const db = await connectDB();
  const cartRes = await db.execute<(RowDataPacket & Carts)[]>(sql`
    select ID from carts where user_id = ${userId};
  `);
  const cart = cartRes[0][0];
  if (!cart) {
    return {
      data: null,
    };
  }
  const cartFullRes = await db.execute<(RowDataPacket & CartFull)[]>(sql`
    select ID, user_id, game_list
    from carts
             join (select cart_id,
                          json_arrayagg(json_object('ID', games.ID, 'name', games.name, 'type', games.type, 'developer',
                                                    games.developer,
                                                    'publisher', games.publisher, 'sale_price', games.sale_price,
                                                    'slug', games.slug, 'images', images)) as game_list
                   from cart_details
                            join (select games.*,
                                         json_arrayagg(json_object('ID', game_images.ID, 'type', game_images.type, 'alt',
                                                                   game_images.alt,
                                                                   'game_id', game_images.game_id, 'pos_row',
                                                                   game_images.pos_row,
                                                                   'url', game_images.url)) as images
                                  from games
                                           join game_images on games.ID = game_images.game_id
                                  group by games.ID) games
                                 on cart_details.game_id = games.ID
                   group by cart_id) cd on carts.ID = cd.cart_id
    where carts.ID = ${cart.ID};
  `);

  return { data: cartFullRes[0][0] as CartFull };
}

export async function countCartByUserId(userId: number) {
  const db = await connectDB();
  const cartRes = await db.execute<(RowDataPacket & Carts)[]>(sql`
    select ID from carts where user_id = ${userId};
  `);
  const cart = cartRes[0][0];
  const cartDetailsCount = await db.execute<
    (RowDataPacket & { count: number })[]
  >(sql`
    select count(*) as count from cart_details where cart_id = ${cart.ID};
  `);

  return cartDetailsCount[0][0];
}

export async function removeItemFromCart({
  gameId,
  cartId,
}: {
  gameId: number;
  cartId: number;
}) {
  const db = await connectDB();
  try {
    await db.execute(sql`
      delete from cart_details where cart_id = ${cartId} and game_id = ${gameId}
    `);
    return { data: null };
  } catch (error) {
    return {
      error: "something went wrong",
    };
  }
}
