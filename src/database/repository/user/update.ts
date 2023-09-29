import { connectDB, sql } from "@/database";
import { Users } from "@/database/models";
import { Connection } from "mysql2/promise";

export async function updateUserById(
  id: number,
  { user, db }: { user: Partial<Omit<Users, "ID">>; db?: Connection },
) {
  const _db = db || (await connectDB());

  _db.execute(sql`
    update users
    set ${Object.entries(user)
      .map(([key, value]) => {
        return (
          key + "=" + (typeof value === "string" ? +"'" + value + "'" : value)
        );
      })
      .join(", ")}
    where ID = ${id}
  `);
}
