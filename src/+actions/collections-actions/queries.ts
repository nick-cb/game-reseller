'use server';

import { query, sql } from '@/database';

export async function getAllCollections() {
  return await query<Collections[]>(sql`
    select * from collections
  `);
}
