'use server';

import { query, sql } from '@/db/query-helper';

export async function getAllCollections() {
  return await query<Collections[]>(sql`
    select * from collections
  `);
}
