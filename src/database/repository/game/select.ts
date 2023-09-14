import {connectDB, sql} from "@/database";

export async function findGameBySlug(slug: string) {
    const db = await connectDB();
    return await db.execute(sql`
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
                                                                                   'ID', ID, 'key', media_key,
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