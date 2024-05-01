'use server';

import { querySingle, sql } from '@/database';
import { Game } from '@/database/models/model';

export type GetMinimalInfoParams = {
  ID?: number;
  slug?: string;
};
export async function getMinimalInfoBySlug(params: GetMinimalInfoParams) {
  const { ID = 0, slug = '' } = params;
  return querySingle<Game>(sql`
    select g.*
    from games g
    where if(${!!slug}, g.slug = ${slug}, true)
    and if(${!!ID}, g.ID = ${ID}, true)
  `);
}
