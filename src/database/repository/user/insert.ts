import { connectDB, sql } from "@/database";
import { Users } from "@/database/models";
import { Connection, ResultSetHeader } from "mysql2/promise";

type IUserPayload = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  avatar: string | null;
};
type IUserResult = ResultSetHeader & Users;

export async function insertUser({
  user,
  db,
}: {
  user: IUserPayload;
  db: Connection;
}) {
  const _db = db || (await connectDB());

  const result = await _db.execute<ResultSetHeader>(sql`
      insert into users (full_name, display_name, email, password, avatar)
      values ('${user.full_name}', '${user.display_name}', '${user.email}', '${user.password}', '${user.avatar}');
  `);
  console.log(result);
  if ("insertId" in result[0]) {
    const insertedUser = await _db.execute<IUserResult[]>(sql`
      select * from users where ID = ${parseInt(
        result[0].insertId.toString(),
      )}
    `);
    return { data: insertedUser[0][0] };
  }

  throw new Error(
    "Something went wrong when create user: " + JSON.stringify(user),
  );
}
