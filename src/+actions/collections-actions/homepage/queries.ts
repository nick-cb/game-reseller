'use server';

import { query, querySingle, sql } from '@/db/query-helper';

const groupImageByType = (type: string, colors = false) => {
  const colorQuery = colors
    ? sql`json_object(
            'highestSat', gi.colors -> '$.highestSat',
            'palette', gi.colors -> '$.palette'
      )`
    : sql`json_object('highestSat', json_array(), 'palette', json_array())`;

  return sql`
  select coalesce(
    json_arrayagg(
       json_object(
           'ID', gi.ID,
           'url', gi.url,
           'type', gi.type,
           'alt', gi.alt,
           'row', gi.pos_row,
           'colors', ${colorQuery}
       )
    ), json_array())
  from game_images gi
  where gi.game_id = g.ID
    and gi.type = ${type}
  group by type
`;
};

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
           json_object(
               'portraits',
               (${groupImageByType('portrait')}),
               'landscapes',
               (${groupImageByType('landscape')}),
               'logos',
               (${groupImageByType('logo')})
           ) as images
    from collection_details cd
           left join games g on cd.game_id = g.ID
    where cd.collection_id = ${collection.ID};
  `);

  return { collection, game_list };
}

type RequiredGameAttributes =
  | 'ID'
  | 'name'
  | 'slug'
  | 'developer'
  | 'avg_rating'
  | 'sale_price'
  | 'description'
  | 'images';
export type GameItem = Pick<GameWithImages, RequiredGameAttributes> & {
  videos: Array<Videos>;
};
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
                           json_object(
                              'portraits',
                              (${groupImageByType('portrait')}),
                              'landscapes', json_array(),
                              'logos', json_array()
                           ),
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
                           json_object(
                              'portraits', (${groupImageByType('portrait')}),
                              'landscapes', (${groupImageByType('landscape')})
                           ),
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

type GetPillarGroupParams = {
  names: string[];
};
export async function getPillarGroup(params: GetPillarGroupParams) {
  const { names } = params;
  return query<CategoryRow[]>(sql`
    select c.ID,
           c.name,
           cd.collection_id,
           json_arrayagg(
               json_object(
                   'ID', g.ID,
                   'name', g.name,
                   'slug', g.slug,
                   'sale_price', g.sale_price,
                   'developer', g.developer,
                   'avg_rating', g.avg_rating,
                   'images',
                   json_object(
                       'portraits', (${groupImageByType('portrait')}),
                       'landscapes', json_array(),
                       'logos', json_array()
                   )
               )
           ) as game_list
    from collection_details cd
           inner join (select collection_id, group_concat(game_id order by game_id desc) as game_ids
                       from collection_details
                       group by collection_id) group_max on cd.collection_id = group_max.collection_id
           left join games as g on cd.game_id = g.ID
           left join collections c on c.ID = cd.collection_id
    where find_in_set(c.collection_key, ${names.join(',')})
      and find_in_set(cd.game_id, game_ids) <= 10
    group by cd.collection_id;
  `);
}
