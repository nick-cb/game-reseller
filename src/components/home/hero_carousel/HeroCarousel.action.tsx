"use server";

import { FCollectionByName } from "@/actions/collections";
import { querySingle, sql } from "@/database";
import { Collections } from "@/database/models";

export async function getHeroCarousel() {
  const { data: collection } = await querySingle<Collections>(sql`
    select * from collections where collection_key = 'hero_carousel'
  `);

  if (!collection) {
    return { data: undefined };
  }

  const { data } = await querySingle<{
    list_game: FCollectionByName["list_game"];
  }>(sql`
    select json_arrayagg(
        json_object(
          'ID', g.ID, 'name', g.name, 'slug', g.slug,'sale_price', 
          g.sale_price, 'developer', g.developer, 'avg_rating', avg_rating,
          'images', (select json_arrayagg(
                json_object(
                  'ID', gi.ID, 'url', gi.url, 'type', 
                  gi.type, 'alt', gi.alt, 'row', gi.pos_row
                )
              ) as images from game_images gi where gi.game_id = g.ID)
        )
      ) as list_game
    from collection_details cd
    left join games g on cd.game_id = g.ID
    where cd.collection_id = ${collection.ID}
    group by cd.collection_id
  `);

  return {
    data: {
      ...collection,
      list_game: data?.list_game || [],
    },
  };
}
