"use server";

import { query, sql } from "@/database";
import { Tags } from "@/database/models";

export default async function findTagByGroupName(groupName: string) {
  return query<Tags[]>(sql`
    select * from tags where group_name = ${groupName}
  `);
}
