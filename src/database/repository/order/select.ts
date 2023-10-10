import { connectDB, sql } from "@/database";
import { Orders } from "@/database/models";
import { RowDataPacket } from "mysql2";

export async function findOrderByIntent(paymentIntent: string) {
  const db = await connectDB();
  const response = await db.execute<(RowDataPacket & Orders)[]>(sql`
    select * from orders where payment_intent = '${paymentIntent}';
  `);

  return {
    data: response[0][0],
  };
}
