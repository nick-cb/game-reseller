"use server";

import { connectDB, sql } from "@/database";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Collections, Game, GameImages } from "@/database/models";
import { FVideoFullInfo, OmitGameId } from "@/actions/game/select";

export async function getCollections(query: { keys: string[] }) {
  const { keys } = query;
  if (keys.length === 0) {
    return [];
  }
  const queryCondition = `where c.key = ${keys[0]}`;
  for (const key of keys.slice(1)) {
    queryCondition.concat(`and c.key = ${key}`);
  }
  const db = await connectDB();
  const result = await db.execute(sql`
select 
  * 
from 
  collections c 
  left join (
    select 
      collection_id, 
      json_arrayagg(
        json_object(
          'ID', g.ID, 'name', g.name, 'slug', g.slug,'sale_price', 
          g.sale_price, 'developer', g.developer, 
          'images', g.images, 'videos', g.videos
        )
      ) as list_game 
    from 
      collection_detail 
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
                          'ID', ID, 'key', "key", 'content_type', 
                          content_type, 'duration', duration, 
                          'height', height, 'width', width, 
                          'url', url
                        )
                      ) as variants 
                    from 
                      video_variants 
                    group by 
                      recipe_id
                  ) vv on vv.recipe_id = vr.ID 
                group by 
                  vr.video_id
              ) vc on vc.video_id = v.ID 
            group by 
              game_id
          ) v on games.ID = v.game_id
      ) g on collection_detail.game_id = g.ID 
    group by 
      collection_id
  ) cd on c.ID = cd.collection_id
  ${queryCondition ? queryCondition : ""}
;
`);

  return result[0];
}

export type FCollectionByName = RowDataPacket &
  Collections & {
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
      videos: FVideoFullInfo[];
    })[];
  };

export async function getCollectionByKey(key: string[], db?: Connection) {
  const _db = db || (await connectDB());
  return _db.execute<FCollectionByName[]>(sql`
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
                      video_variants 
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
  ) cd on c.ID = cd.collection_id where find_in_set(c.collection_key, '${key.join(
    ",",
  )}');
`);
}

export async function getAllCollections({ db }: { db?: Connection }) {
  const _db = db || (await connectDB());
  const response = await _db.execute<(RowDataPacket & Collections)[]>(sql`
    select * from collections;
  `);

  return { data: response[0] };
}
