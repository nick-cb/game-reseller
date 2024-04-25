'use server';

import { querySingle, sql } from '@/database';
import { groupImageByType } from '../share/images';
import Reviews, {
  Game,
  GameImageGroup,
  Polls,
  SystemDetails,
  Systems,
  Tags,
  VideoRecipes,
  VideoVariants,
  Videos,
} from '@/database/models/model';

export type FindBySlugResult = Game & {
  images: GameImageGroup;
  videos: (Videos & {
    recipes: (VideoRecipes & {
      variants: VideoVariants[];
    })[];
  })[];
  systems: (Systems & {
    details: SystemDetails[];
  })[];
  tags: Tags[];
  reviews: Reviews[];
  polls: Polls[];
};
type FindBySlugParams = {
  slug: string;
};
export async function findBySlug(params: FindBySlugParams) {
  const { slug } = params;

  const videoQuery = sql`
    select json_arrayagg(
              json_object(
                 'ID', v.ID,
                 'thumbnail', v.thumbnail,
                 'recipes',
                 (select json_arrayagg(
                             json_object(
                                 'ID', vr.ID,
                                 'media_ref_id', vr.media_ref_id,
                                 'recipe', vr.recipe,
                                 'variants',
                                 (select json_arrayagg(
                                             json_object(
                                                 'ID', rv.ID,
                                                 'media_key', rv.media_key,
                                                 'content_type', rv.content_type,
                                                 'duration', rv.duration,
                                                 'height', rv.height,
                                                 'width', rv.width,
                                                 'url', rv.url
                                             )
                                         )
                                  from recipe_variants rv
                                  where rv.recipe_id = vr.ID)
                             )
                         ) video_recipes
                  from video_recipes vr
                  where vr.video_id = v.ID)
               )
           )
    from videos v
    where v.game_id = g.ID
  `;
  const systemQuery = sql`
    select json_arrayagg(
                       json_object(
                           'ID', s.ID,
                           'os', s.os,
                           'details',
                           (select json_arrayagg(
                                       json_object(
                                           'ID', sd.ID,
                                           'title', sd.title,
                                           'description', sd.minimum,
                                           'recommended', sd.recommended
                                       )
                                   )
                            from system_details sd
                            where sd.system_id = s.ID)
                       )
                   )
    from systems s
    where s.game_id = g.ID
  `;
  const tagQuery = sql`
    select json_arrayagg(
                       json_object(
                           'ID', t.ID,
                           'name', t.name,
                           'tag_key', t.tag_key,
                           'group_name', t.group_name
                       )
                   )
    from tags t
           left join tag_details td on t.ID = td.tag_id
      and td.game_id = g.ID
  `;
  const reviewQuery = sql`
    select json_arrayagg(
                   json_object(
                       'ID', r.ID,
                       'type', r.type,
                       'outlet', r.outlet,
                       'total_score', r.total_score,
                       'earned_score', r.earned_score,
                       'body', r.body,
                       'author', r.author,
                       'text', r.text
                   )
               )
    from reviews r
    where r.game_id = g.ID
  `;
  const pollQuery = sql`
    select json_arrayagg(
                       json_object(
                           'ID', p.ID,
                           'text', p.text,
                           'result_title', p.result_title,
                           'result_text', p.result_text,
                           'result_emoji', p.result_emoji,
                           'emoji', p.emoji
                       )
                   )
    from polls p
    where p.ID = g.ID
  `;

  return await querySingle<FindBySlugResult>(sql`
    select g.*,
           json_object(
             'portraits', (${groupImageByType('portrait')}),
             'landscapes', (${groupImageByType('landscape')}),
             'logos', coalesce((${groupImageByType(['logo', 'ProductLogo'])}), json_array())
           ) as images,
           (${videoQuery}) as videos,
           (${systemQuery}) as systems,
           (${tagQuery}) as tags,
           (${reviewQuery}) as reviews,
           (${pollQuery}) as polls
    from games g
    where g.slug = ${slug}
  `);
}
