"use server";

import { query, sql } from "@/database";
import { Collections, Game, GameImages, Videos } from "@/database/models";
import { OmitGameId } from "@/actions/game/select";

export type FCollectionByName = Collections & {
  list_game: (Pick<
    Game,
    | "ID"
    | "name"
    | "slug"
    | "developer"
    | "avg_rating"
    | "sale_price"
    | "description"
  > & {
    images: OmitGameId<GameImages>[];
    videos: Videos[];
  })[];
};

export async function getCollectionByKey(key: string[]) {
  return await query<FCollectionByName[]>(sql`
select 
  c.*,
  cd.list_game
from 
  collections c 
  left join (
    select 
      collection_id, 
      json_arrayagg(
        json_object(
          'ID', g.ID, 'name', g.name, 'slug', g.slug,'sale_price', 
          g.sale_price, 'developer', g.developer, 'avg_rating', avg_rating,
          'images', g.images, 'videos', g.videos
        )
      ) as list_game 
    from 
      collection_details 
      left join (
        select 
          games.*, 
          gi.images, 
          v.videos 
        from 
          games 
          left join (
            select 
              gi.game_id, 
              json_arrayagg(
                json_object(
                  'ID', gi.ID, 'url', gi.url, 'type', 
                  gi.type, 'alt', gi.alt, 'row', gi.pos_row
                )
              ) as images 
            from 
              game_images gi 
            group by 
              game_id
          ) gi on games.ID = gi.game_id 
          left join (
            select 
              v.game_id, 
              json_arrayagg(
                json_object(
                  'ID', v.ID, 'thumbnail', v.thumbnail, 
                  'recipes', vc.recipes
                )
              ) as videos 
            from 
              videos v 
              left join (
                select 
                  vr.video_id, 
                  json_arrayagg(
                    json_object(
                      'ID', vr.ID, 'media_ref_id', vr.media_ref_id, 
                      'recipe', vr.recipe, 'variants', 
                      vv.variants, 'manifest', vr.manifest
                    )
                  ) as recipes 
                from 
                  video_recipes vr 
                  left join (
                    select 
                      recipe_id, 
                      json_arrayagg(
                        json_object(
                          'ID', ID, 'media_key', media_key, 'content_type', 
                          content_type, 'duration', duration, 
                          'height', height, 'width', width, 
                          'url', url
                        )
                      ) as variants 
                    from 
                      recipe_variants 
                    group by 
                      recipe_id
                  ) vv on vv.recipe_id = vr.ID 
                group by 
                  vr.video_id
              ) vc on vc.video_id = v.ID 
            group by 
              game_id
          ) v on games.ID = v.game_id
      ) g on collection_details.game_id = g.ID 
    group by 
      collection_id
  ) cd on c.ID = cd.collection_id where find_in_set(c.collection_key, ${key.join(
    ",",
  )});
`);
}

export async function getAllCollections() {
  return query<Collections[]>(sql`
    select * from collections;
  `);
}

export async function getCollectionByKey2(names: string[]) {
  return query<FCollectionByName[]>(sql`
    select c.ID,
           c.name,
           json_arrayagg((select json_object(
                                     'ID', g.ID, 'name', g.name, 'slug', g.slug, 'developer', g.developer,
                                     'avg_rating', g.avg_rating, 'sale_price', g.sale_price, 'description', g.description,
                                     'images', (select json_arrayagg(
                                                           json_object('ID', gi.ID, 'url', gi.url, 'type', gi.type, 'alt',
                                                                       gi.alt, 'game_id', gi.game_id, 'row', gi.pos_row,
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
                                     'videos',
                                     (select json_arrayagg(
                                                 json_object('ID', v.ID,
                                                             'thumbnail', v.thumbnail
                                                 )
                                             )
                                      from videos v
                                      where v.game_id = g.ID
                                      limit 1)
                                 )
                          from games g
                          where g.ID = cd.game_id)) as list_game
    from collections c
           left join collection_details cd on c.ID = cd.collection_id
    where collection_key in (${names.join(',')})
    group by c.ID;
`);
}
