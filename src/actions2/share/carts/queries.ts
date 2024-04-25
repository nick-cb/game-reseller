'use server';

import { querySingle, sql } from "@/database";

export async function deleteCartByID(ID: number) {
  return await querySingle(sql`
    delete from cart_details where cart_id = ${ID};
  `);
}
