"use server";

import { CreateOrderPayload, Orders } from "@/database/models";
import { insertSingle, querySingle, sql, updateSingle } from "@/database";

export async function createOrder({ order }: { order: CreateOrderPayload }) {
  return insertSingle(sql`
    insert into orders (payment_intent, amount, payment_method, payment_service, 
                        created_at, items, status, succeeded_at,
                        canceled_at, card_number, card_type, user_id)
    values (${order.payment_intent}, ${order.amount}, ${order.payment_method}, 
            ${order.payment_service}, ${order.canceled_at}, ${order.items}, 
            ${order.status}, ${order.succeeded_at}, ${order.canceled_at}, 
            ${order.card_number}, ${order.card_type}, ${order.user_id}
           )
  `);
}

export async function findOrderByIntent(paymentIntent: string) {
  return querySingle<Orders>(sql`
    select * from orders where payment_intent = '${paymentIntent}';
  `);
}

export async function findOrderById(
  id: number,
  options: {
    userId: number;
  },
) {
  const { userId } = options;
  return await querySingle<Orders>(sql`
    select * from orders where id = ${id} and user_id = ${userId};
  `);
}

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
