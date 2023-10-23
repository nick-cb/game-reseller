import { connectDB, sql } from "@/database";
import { Connection } from "mysql2/promise";
import { FCollectionByName } from "../collections";

export async function getHeroCarousel(option?: { db: Connection }) {
  const { db } = option || {};
  const _db = db || (await connectDB());
  const response = await _db.execute<FCollectionByName[]>(sql`
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
          'images', g.images
        )
      ) as list_game 
    from 
      collection_details 
      left join (
        select 
          games.*, 
          gi.images
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
      ) g on collection_details.game_id = g.ID 
    group by 
      collection_id
  ) cd on c.ID = cd.collection_id where find_in_set(c.collection_key, 'hero_carousel');
`);

  return { data: response[0][0] };
}

/*
 * fortnite
 * civ 6
 * God of war
 * Genshin impact
 * Mortal combat 1
 * Cyberpunk 2077
 * Cities: Skylines
 * */
