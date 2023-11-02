"use server";

import { sql, updateSingle } from "@/database";
import { Orders } from "@/database/models";

export async function updateOrder(
  id: number,
  {
    order,
  }: {
    order: Partial<Omit<Orders, "ID">>;
  },
) {
  return updateSingle(sql`
    update orders 
    set ${Object.entries(order)
      .map(([key, value]) => {
        return key + "=" + value;
      })
      .join(", ")}
    where ID = ${id}
  `);
}

export async function updateOrderByPaymentIntent(
  id: string,
  {
    order,
  }: {
    order: Partial<Omit<Orders, "ID">>;
  },
) {
  return updateSingle(sql`
    update orders 
    set ${Object.entries(order)
      .map(([key, value]) => {
        return key + "=" + value;
      })
      .join(", ")}
    where payment_intent = ${id}
  `);
}
