import { connectDB, sql } from "@/database";
import { Users } from "@/database/models";
import { Connection, RowDataPacket } from "mysql2/promise";

type FUserResult = RowDataPacket & Users;
export async function findUserByEmail({
  email,
  db,
}: {
  email: string;
  db?: Connection;
}) {
  const _db = db || (await connectDB());

  const result = await _db.execute<FUserResult[]>(sql`
      select * from users where email = '${email}'
  `);

  return {
    data: result[0][0],
  };
}

export async function findUserById({ id, db }: { id: number; db?: Connection }) {
  const _db = db || (await connectDB());

  const result = await _db.execute<(RowDataPacket & Users)[]>(sql`
      select * from users where ID = '${id}'
  `);

  return {
    data: result[0][0],
  };
}
