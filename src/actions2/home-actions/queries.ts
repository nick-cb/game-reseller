'use server';

import { query, querySingle, sql } from '@/database';
import { Collections } from '@/database/models/model';
import { GameItem } from '@/actions2/home-actions/category';

export async function getheroCarousel() {
  const { data: collection } = await querySingle<Partial<Collections>>(sql`
    select ID, name from collections where collection_key = 'hero_carousel'
  `);

  if (!collection) {
    return { game_list: [] as GameItem[] };
  }

  const { data: game_list } = await query<GameItem[]>(sql`
    select g.ID,
           g.name,
           g.slug,
           g.sale_price,
           g.developer,
           g.avg_rating,
           (select json_arrayagg(
                       json_object(
                           'ID', gi.ID, 'url', gi.url, 'type',
                           gi.type, 'alt', gi.alt, 'row', gi.pos_row
                       )
                   ) as images
            from game_reseller.game_images gi
            where gi.game_id = g.ID) as images
    from game_reseller.collection_details cd
           left join game_reseller.games g on cd.game_id = g.ID
    where cd.collection_id = ${collection.ID};
  `);

  return { collection, game_list };
}

type CategoryRow = Collections & {
  game_list: GameItem[];
};
type GetCategoryRowParams = {
  names: string[];
};
export async function getCategoryRows(params: GetCategoryRowParams) {
  const { names } = params;
  return query<CategoryRow[]>(sql`
    select c.ID,
           c.name,
           c.collection_key,
           json_arrayagg(
               (select json_object(
                           'ID', g.ID,
                           'name', g.name,
                           'slug', g.slug,
                           'developer', g.developer,
                           'avg_rating', g.avg_rating,
                           'sale_price', g.sale_price,
                           'description', g.description,
                           'images',
                           (select json_arrayagg(
                                       json_object(
                                           'ID', gi.ID,
                                           'url', gi.url,
                                           'type', gi.type,
                                           'alt', gi.alt,
                                           'game_id', gi.game_id,
                                           'row', gi.pos_row,
                                           'colors',
                                           json_object('highestSat', gi.colors -> '$.highestSat')
                                       )
                                   )
                            from ((select *
                                   from game_images
                                   where game_images.type = 'landscape'
                                     and game_images.game_id = g.ID
                                   limit 1)
                                  union
                                  (select *
                                   from game_images
                                   where game_images.type = 'portrait'
                                     and game_images.game_id = g.ID
                                   limit 1)) as gi),
                            'videos', json_array()
                       )
                from games g
                where g.ID = cd.game_id)) as game_list
    from collections c
           left join collection_details cd on c.ID = cd.collection_id
    where collection_key in (${names.join(',')})
    group by c.ID;
  `);
}

type GetFeatureRowParams = {
  name: string;
};
export async function getFeatureRow(params: GetFeatureRowParams) {
  const { name } = params;
  return querySingle<CategoryRow>(sql`
    select c.ID,
           c.name,
           json_arrayagg(
               (select json_object(
                           'ID', g.ID,
                           'name', g.name,
                           'slug', g.slug,
                           'developer', g.developer,
                           'avg_rating', g.avg_rating,
                           'sale_price', g.sale_price,
                           'description', g.description,
                           'images',
                           (select json_arrayagg(
                                       json_object(
                                           'ID', gi.ID,
                                           'url', gi.url,
                                           'type', gi.type,
                                           'alt', gi.alt,
                                           'game_id', gi.game_id,
                                           'row', gi.pos_row,
                                           'colors',
                                           json_object('highestSat', gi.colors -> '$.highestSat')
                                       )
                                   )
                            from ((select *
                                   from game_images
                                   where game_images.type = 'landscape'
                                     and game_images.game_id = g.ID
                                   limit 1)
                                  ) as gi),
                            'videos', 
                            (select json_arrayagg(
                                         json_object('ID', v.ID,
                                                     'thumbnail', v.thumbnail))
                             from videos v
                             where v.game_id = g.ID
                             limit 1)
                       )
                from games g
                where g.ID = cd.game_id)) as game_list
    from collections c
           left join collection_details cd on c.ID = cd.collection_id
    where collection_key in (${name})
    group by c.ID;
  `);
}

{
  /*
- category
  - share
  - homepage
    -> getHeroCarousel
    -> getCategoryRows
  - game_detail
    -> getGameDetailCarousel
- game
  - homepage
  - game_detail
*/
}

{
  /*
- share
  - category
  - game
- homepage
  - category
    -> getheroCarousel
    -> getCategoryRows
  - game
    -> getGameInfo
- game_detail
  - category
  - game
    -> getGameDetailCarousel
*/
}
