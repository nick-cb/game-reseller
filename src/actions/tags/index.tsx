"use server";

import { Connection, RowDataPacket } from "mysql2/promise";
import { connectDB, sql } from "@/database";
import { Tags } from "@/database/models";

type FTags = (RowDataPacket & Tags)[];
export default async function findTagByGroupName(
  groupName: string,
  db?: Connection,
) {
  const _db = db || (await connectDB());
  return _db.execute<FTags>(sql`
    select * from tags where group_name = '${groupName}'
  `);
}
