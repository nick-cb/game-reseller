'use server';

import { query, querySingle, sql } from '@/database';
import { groupImageByType } from '../+share/queries/images';

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

export type GetGameListWithMinimalInfoParams = {
  limit: number;
  skip: number;
  keyword: string;
};
export async function getGameListWithMinimalInfo(params: GetGameListWithMinimalInfoParams) {
  const { limit, skip, keyword = '' } = params;
  const selectQuery = sql`
    select g.*,
           json_object(
               'portraits', (${groupImageByType('portrait')}),
               'landscapes', json_array(),
               'logos', json_array()
           ) as images
    from games g
    where g.name like ${'%' + keyword + '%'}
    limit ${limit} offset ${skip};
  `;
  const countQuery = sql`
    select count(*)
    from games g
    where g.name like ${'%' + keyword + '%'}
    limit ${limit} offset ${skip};
  `;
  const [games, { data: { total } = { total: 0 } }] = await Promise.all([
    query<Game[]>(selectQuery),
    querySingle<{ total: number }>(countQuery),
  ]);

  return { ...games, total };
}

export type GetGameListParams = {
  keyword: string;
  limit: number;
  skip: number;
};
export type GameRow = Game & {
  images: GameImageGroup;
};
export async function getGameList(params: GetGameListParams) {
  const { limit, skip, keyword = '' } = params;
  const countQuery = sql`
    select count(*) as total
    from games g
    where g.name like ${'%' + keyword + '%'}
  `;
  const selectQuery = sql`
    select g.*,
           json_object(
               'portraits', (${groupImageByType('portrait')}),
               'landscapes', json_array(),
               'logos', json_array()
           ) as images
    from games g
    where g.name like ${'%' + keyword + '%'}
    order by g.name
    limit ${limit} offset ${skip};
  `;

  const [games, { data: { total } = { total: 0 } }] = await Promise.all([
    query<GameRow[]>(selectQuery),
    querySingle<{ total: number }>(countQuery),
  ]);

  return { ...games, total };
}
