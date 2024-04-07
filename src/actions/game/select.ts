"use server";

import { pool, query, querySingle, sql } from "@/database";
import Reviews, {
  Game,
  GameImages,
  Polls,
  SystemDetails,
  Systems,
  Tags,
  VideoRecipes,
  VideoVariants,
  Videos,
} from "@/database/models";
import { Connection, RowDataPacket } from "mysql2/promise";

export type OmitGameId<T extends { game_id: number }> = Omit<T, "game_id">;
export type OmitVideoId<T extends { video_id: number }> = Omit<T, "video_id">;
export type OmitRecipeId<T extends { recipe_id: number }> = Omit<
  T,
  "recipe_id"
>;
export type OmitSystemId<T extends { system_id: number }> = Omit<
  T,
  "system_id"
>;

export type FBySlug = RowDataPacket &
  Game & {
    images: OmitGameId<GameImages>[];
    videos: OmitGameId<FVideoFullInfo>[];
    systems: OmitGameId<
      Systems & {
        details: OmitSystemId<SystemDetails>[];
      }
    >[];
    tags: Tags[];
    reviews: OmitGameId<Reviews>[];
    polls: OmitGameId<Polls>[];
  };

export type FVideoFullInfo = Videos & {
  recipes: (OmitVideoId<VideoRecipes> & {
    variants: OmitRecipeId<VideoVariants>[];
  })[];
};

export async function findGameBySlug(slug: string) {
  return querySingle<FBySlug>(sql`
  select *,
       gi.images,
       if(
               v.videos is null,
               json_array(),
               v.videos
           )     as videos,
       s.systems as systems,
       td.tags   as tags,
       r.reviews as reviews,
       p.polls   as polls
  from games
         left join (select gi.game_id,
                           json_arrayagg(
                                   json_object(
                                           'ID', gi.ID, 'url', gi.url, 'type',
                                           gi.type, 'alt', gi.alt, 'row', gi.pos_row
                                       )
                               ) as images
                    from game_images gi
                    group by game_id) gi on games.ID = gi.game_id
         left join (select v.game_id,
                           json_arrayagg(
                                   json_object(
                                           'ID', v.ID, 'thumbnail', v.thumbnail,
                                           'recipes', vc.recipes
                                       )
                               ) as videos
                    from videos v
                             left join (select vr.video_id,
                                               json_arrayagg(
                                                       json_object(
                                                               'ID', vr.ID, 'media_ref_id', vr.media_ref_id,
                                                               'recipe', vr.recipe, 'variants',
                                                               vv.variants, 'manifest', vr.manifest
                                                           )
                                                   ) as recipes
                                        from video_recipes vr
                                                 left join (select recipe_id,
                                                                   json_arrayagg(
                                                                           json_object(
                                                                                   'ID', ID, 'media_key', media_key,
                                                                                   'content_type',
                                                                                   content_type, 'duration', duration,
                                                                                   'height', height, 'width', width,
                                                                                   'url', url
                                                                               )
                                                                       ) as variants
                                                            from recipe_variants
                                                            group by recipe_id) vv on vv.recipe_id = vr.ID
                                        group by vr.video_id) vc on vc.video_id = v.ID
                    group by game_id) v on games.ID = v.game_id
         left join (select s.game_id,
                           json_arrayagg(
                                   json_object(
                                           'ID', s.ID, 'os', s.os, 'details', sd.details
                                       )
                               ) as systems
                    from systems s
                             left join (select system_id,
                                               json_arrayagg(
                                                       json_object(
                                                               'ID', sd.ID, 'title', sd.title, 'minimum',
                                                               sd.minimum, 'recommended', sd.recommended
                                                           )
                                                   ) as details
                                        from system_details sd
                                        group by system_id) sd on s.ID = sd.system_id
                    group by game_id) s on if(games.base_game_id is null, games.ID, games.base_game_id) = s.game_id
         left join (select tag_details.game_id,
                           json_arrayagg(
                                   json_object(
                                           'ID', t.ID, 'name', t.name, 'group_name',
                                           t.group_name
                                       )
                               ) as tags
                    from tag_details
                             join tags t on tag_details.tag_id = t.ID
                    group by game_id) td on td.game_id = s.game_id
         left join (select game_id,
                           json_arrayagg(
                                   json_object(
                                           'ID', reviews.ID, 'type', reviews.type,
                                           'outlet', reviews.outlet, 'total_score',
                                           reviews.total_score, 'earned_score',
                                           reviews.earned_score, 'body', reviews.body,
                                           'author', reviews.author, 'text',
                                           reviews.text
                                       )
                               ) as reviews
                    from reviews
                    group by game_id) r on if(games.base_game_id is null, games.ID, games.base_game_id) = r.game_id
         left join (select game_id,
                           json_arrayagg(
                                   json_object(
                                           'ID', polls.ID, 'text', polls.text,
                                           'result_title', polls.result_title,
                                           'result_text', polls.result_text,
                                           'result_emoji', polls.result_emoji,
                                           'emoji', polls.emoji
                                       )
                               ) as polls
                    from polls
                    group by game_id) p on if(games.base_game_id is null, games.ID, games.base_game_id) = p.game_id
where slug = ${slug};
  `);
}

type FMappingById = Game & {
  images: OmitGameId<GameImages>[];
};
export async function findMappingById(id: number) {
  return query<FMappingById[]>(sql`
    select *, gi.images
    from games
             left join (select game_id,
                               json_arrayagg(json_object('ID', gi.ID, 'type', gi.type, 'pos_row', gi.pos_row, 'alt', gi.alt,
                                                         'url', gi.url)) as images
                        from game_images gi
                        group by game_id) gi on games.ID = gi.game_id
    where base_game_id = ${id};
`);
}

type GGameByTags = RowDataPacket &
  Game & {
    images: OmitGameId<GameImages>[];
  };
export async function groupGameByTags({
  tags,
  limit = 20,
  skip = 0,
  keyword,
  collection,
}: {
  tags: string[];
  db?: Connection;
  limit?: number;
  skip?: number;
  keyword?: string;
  collection?: string;
}) {
  const countReq = sql`
      select count(*) as count
      from (
        select games.* 
        from games
                 join (select c.ID, c.collection_key, cd.game_id
                    from collections c
                        join collection_details cd on c.ID = cd.collection_id) cd on games.ID = cd.game_id
                 join tag_details on games.ID = tag_details.game_id
                 join tags on tag_details.tag_id = tags.ID
        where games.type = 'base_game'
          and if(${!!collection}, cd.collection_key = ${collection}, 1)
          and if(${tags.length > 0}, tags.tag_key in (${tags
            .map((tag) => tag)
            .join(",")}), 1)
          and if(${!!keyword}, games.name like '%${keyword}%', 1)
        group by games.ID
        having if(${tags.length > 0}, count(distinct tag_id) = ${
          tags.length
        }, 1)
      ) as grouped
  `;

  const gameReq = sql`
      select games.*, gi.images
      from games
               join (select c.ID, c.collection_key, cd.game_id
                    from collections c
                        join collection_details cd on c.ID = cd.collection_id) cd on games.ID = cd.game_id
               left join (select game_id,
                                 json_arrayagg(json_object('ID', ID, 'type', type, 'url', url, 'pos_row', pos_row, 'alt',
                                                           alt)) as images
                          from game_images
                          group by game_id) gi
                         on games.ID = gi.game_id
               join tag_details on games.ID = tag_details.game_id
               join tags on tag_details.tag_id = tags.ID
      where games.type = 'base_game'
        and if(${!!collection}, cd.collection_key = ${collection}, 1)
        and if(${tags.length > 0}, tags.tag_key in (${tags
          .map((tag) => tag)
          .join(",")}), 1)
        and if(${!!keyword}, games.name like '%${keyword}%', 1)
      group by games.ID
      having if(${tags.length > 0}, count(distinct tag_id) = ${
        tags.length
      }, 1)
      limit ${limit} offset ${skip}
      ;
  `;

  const [{ data }, { data: count }] = await Promise.all([
    query<GGameByTags[]>(gameReq),
    querySingle<{ count: number }>(countReq),
  ]);

  return {
    data,
    total: count?.count || 0,
  };
}

export async function countGameAddonsBySlug(slug: string) {
  const { data: game } = await querySingle<Game>(sql`
    select ID from games where slug = ${slug};
  `);

  if (!game) {
    return { data: 0 };
  }

  return await querySingle<number>(sql`
    select count(*) as count from games where base_game_id = ${game.ID}
  `);
}

export async function countGameAddonsById(id: number) {
  return querySingle<number>(sql`
    select count(*) as count from games where base_game_id = ${id}
  `);
}

export async function getGameAddons({
  limit,
  skip,
  keyword,
  gameId,
}: {
  limit?: number;
  skip?: number;
  keyword?: string;
  gameId: number;
}) {
  const countReq = sql`
      select count(*) as count
      from games
      where base_game_id = ${gameId} 
        and if(${!!keyword}, games.name like '%${keyword}%', 1)
      group by games.base_game_id;
  `;
  const gameReq = sql`
      select games.*, gi.images
      from games
               left join (select game_id,
                                 json_arrayagg(json_object('ID', ID, 'type', type, 'url', url, 'pos_row', pos_row, 'alt',
                                                           alt)) as images
                          from game_images
                          group by game_id) gi
                         on games.ID = gi.game_id
      where base_game_id = ${gameId} 
        and if(${!!keyword}, games.name like '%${keyword}%', 1)
      limit ${limit} offset ${skip}
      ;
  `;
  const [{ data }, { data: total }] = await Promise.all([
    query<(Game & { images: GameImages[] })[]>(gameReq),
    querySingle<{ count: number }>(countReq),
  ]);
  console.log({count: total?.count})

  return {
    data,
    count: total?.count || 0,
  };
}
