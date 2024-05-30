'use server';

import { querySingle, sql } from "@/database";

export async function updateOrderPaymentIntent(orderID: number, paymentIntent: string) {
  return await querySingle(sql`
    update orders
      set payment_intent = ${paymentIntent}
    where ID = ${orderID}
  `);
}
