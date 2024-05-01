'use server';

import { query, sql } from "@/database";
import { Collections } from "@/database/models/model";

export async function getAllCollections() {
  return await query<Collections[]>(sql`
    select * from collections
  `)
}
