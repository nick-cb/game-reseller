'use server';

import { query, querySingle, sql } from '@/database';
import { groupImageByType } from '../../share/queries/images';
import { Game, GameImageGroup } from '@/database/models/model';

type GetGameListParams = {
  limit: number;
  skip: number;
  tags: string[];
  keyword: string;
  collection: string;
};
type GameRow = Game & {
  images: GameImageGroup;
};
export async function getGameList(params: GetGameListParams) {
  const { limit, skip, tags, keyword = '', collection = '' } = params;

  const countQuery = sql`
    select count(*) as total
    from games g
    where g.type = 'base_game'
      and g.name like ${'%' + keyword + '%'}
      and if(${!!collection}, g.ID in (select cd.game_id
                             from collection_details cd
                                    left join collections c on cd.collection_id = c.ID
                             where c.name in (${collection})), true)
      and if(${!!tags.length}, g.ID in (select td.game_id
                             from tag_details td
                                    left join tags t on td.tag_id = t.ID
                             where t.tag_key in (${tags.length ? tags : ''})), true);
  `;
  const selectQuery = sql`
    select g.*,
           json_object(
               'portraits', (${groupImageByType('portrait')}),
               'landscapes', json_array(),
               'logos', json_array()
           ) as images
    from games g
    where g.type = 'base_game'
      and g.name like ${'%' + keyword + '%'}
      and if(${!!collection}, g.ID in (select cd.game_id
                             from collection_details cd
                                    left join collections c on cd.collection_id = c.ID
                             where c.collection_key in (${collection})), true)
      and if(${!!tags.length}, g.ID in (select td.game_id
                             from tag_details td
                                    left join tags t on td.tag_id = t.ID
                             where t.tag_key in (${tags.length ? tags : ''})), true)
    limit ${limit} offset ${skip};
  `;
  const [games, { data: { total } = { total: 0 } }] = await Promise.all([
    query<GameRow[]>(selectQuery),
    querySingle<{ total: number }>(countQuery),
  ]);

  return { ...games, total };
}
