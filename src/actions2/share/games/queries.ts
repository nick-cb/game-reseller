'use server';

import { querySingle, sql } from "@/database";
import { Game } from "@/database/models/model";

export async function getMinimalInfoBySlug(slug: string) {
  return querySingle<Game>(sql`
    select g.* from games g where g.slug = ${slug}
  `);
}
