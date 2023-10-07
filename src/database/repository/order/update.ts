import { connectDB, sql } from "@/database";
import { Orders } from "@/database/models";
import { Connection } from "mysql2/promise";

export async function updateOrder(
  id: number,
  {
    order,
    db,
  }: {
    order: Partial<Omit<Orders, "ID">>;
    db?: Connection;
  },
) {
  const _db = db || (await connectDB());

  return _db.execute(sql`
    update orders 
    set ${Object.entries(order)
      .map(([key, value]) => {
        return (
          key + "=" + (typeof value === "string" ? "'" + value + "'" : value)
        );
      })
      .join(", ")}
    where ID = ${id}
  `);
}

export async function updateOrderByPaymentIntent(id: string, {order, db}:{
    order: Partial<Omit<Orders, "ID">>;
    db?: Connection;
  }) {
  const _db = db || (await connectDB());

  return _db.execute(sql`
    update orders 
    set ${Object.entries(order)
      .map(([key, value]) => {
        return (
          key + "=" + (typeof value === "string" ? "'" + value + "'" : value)
        );
      })
      .join(", ")}
    where payment_intent = ${id}
  `);
}
