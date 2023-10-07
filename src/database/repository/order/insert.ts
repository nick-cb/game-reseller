import { connectDB, sql } from "@/database";
import { Orders } from "@/database/models";
import { Connection } from "mysql2/promise";

export async function createOrder({
  order,
  db,
}: {
  order: Omit<Orders, "ID">;
  db?: Connection;
}) {
  const _db = db || (await connectDB());

  return _db.execute(sql`
    insert into orders (payment_intent, amount, payment_method, payment_service, 
                        created_at, items, status, succeeded_at,
                        canceled_at, card_number, card_type, user_id)
    values ('${order.payment_intent}', '${order.amount}', 
            '${order.payment_method}', '${order.payment_service}', 
            ${!order.canceled_at ? `'${order.created_at}'` : null}, 
            '${order.items}', '${order.status}',
            ${order.succeeded_at ? `'${order.succeeded_at}'` : null}, 
            ${order.canceled_at ? `'${order.canceled_at}'` : null}, 
            ${order.card_number ? `'${order.card_number}'` : null}, 
            ${order.card_type ? `'${order.card_type}'` : null}, 
            '${order.user_id}'
    )
  `);
}
