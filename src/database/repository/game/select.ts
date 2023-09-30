import { connectDB, sql } from "@/database";
import Reviews, {
  Game,
  GameImages,
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

type FBySlug = RowDataPacket &
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
  };

export type FVideoFullInfo = Videos & {
  recipes: (OmitVideoId<VideoRecipes> & {
    variants: OmitRecipeId<VideoVariants>[];
  })[];
};

export async function findGameBySlug(slug: string, db?: Connection) {
  const _db = db || (await connectDB());
  return await _db.execute<FBySlug[]>(sql`
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
                                                            from video_variants
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
where slug = '${slug}';
  `);
}

type FMappingById = RowDataPacket &
  Game & {
    images: OmitGameId<GameImages>[];
  };
export async function findMappingById(id: number, db?: Connection) {
  const _db = db || (await connectDB());

  return _db.execute<FMappingById[]>(sql`
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
  db,
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
  const _db = db || (await connectDB());
  let whereClause = sql`where games.type = 'base_game'`;
  if (collection) {
    whereClause += sql`
      and cd.collection_key = '${collection}'
    `;
  }
  if (tags.length > 0) {
    whereClause += sql`
      and tags.tag_key in (${tags.map((tag) => `\'${tag}\'`).join(",")})
    `;
  }
  if (keyword) {
    whereClause += sql` 
      and games.name like '%${keyword}%'
    `;
  }
  const havingClause = sql`having count(distinct tag_id) = ${tags.length}`;
  const countReq = _db.execute<RowDataPacket[]>(sql`
      select count(*) as total_count
      from (
        select games.* 
        from games
                 join (select c.ID, c.collection_key, cd.game_id
                    from collections c
                        join collection_details cd on c.ID = cd.collection_id) cd on games.ID = cd.game_id
                 join tag_details on games.ID = tag_details.game_id
                 join tags on tag_details.tag_id = tags.ID
        ${whereClause}
        group by games.ID
        ${tags.length > 0 ? havingClause : ""}
      ) as grouped
  `);
  const gameReq = _db.execute<GGameByTags[]>(sql`
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
      ${whereClause}
      group by games.ID
      ${tags.length > 0 ? havingClause : ""}
      limit ${skip}, ${limit}
      ;
  `);
  const [gameRes, countRes] = await Promise.all([gameReq, countReq]);

  return {
    data: gameRes[0],
    total: countRes[0][0]?.total_count || 0,
  };
}
