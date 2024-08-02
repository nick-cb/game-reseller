'use server';

import { groupImageByType } from '@/+actions/+share/queries/images';
import { query, querySingle, sql } from '@/db/query-helper';
import { DefaultPagination } from '@/utils';

export type FindBySlugResult = GameWithImages & {
  videos: FindVideoArrayResult;
  systems: FindSystemDetailsResult;
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
    where p.game_id = g.ID
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

type FindMappingByIDResult = {
  type: string;
  game_list: (Pick<
    Game,
    'ID' | 'name' | 'slug' | 'sale_price' | 'developer' | 'avg_rating' | 'description'
  > & {
    images: GameImageGroup;
  })[];
};
export async function findMappingByID(ID: number) {
  return query<FindMappingByIDResult[]>(sql`
    select type,
           json_arrayagg(
               json_object(
                   'ID', g.ID,
                   'name', g.name,
                   'slug', g.slug,
                   'sale_price', g.sale_price,
                   'developer', g.developer,
                   'avg_rating', g.avg_rating,
                   'description', g.description,
                   'images',
                   json_object(
                     'portraits', json_array(),
                     'landscapes', coalesce((${groupImageByType('landscape')}), json_array()),
                     'logos', json_array()
                   )
               )
           ) as game_list
    from games g
    where base_game_id = ${ID}
    group by type;
  `);
}

export async function hasMapping(slug: string) {
  return querySingle<{ data: boolean }>(sql`
    select exists(select 1 from games where base_game_slug = ${slug}) as data
  `);
}

export type FindMappingListByIndexedInfoParams = {
  base_game_id?: number;
  base_game_slug?: string;
  keyword?: string;
  pagination?: { limit: number; skip: number };
};
export async function findMappingListByIndexedInfo(params: FindMappingListByIndexedInfoParams) {
  const { base_game_id, base_game_slug, keyword } = params;
  const { pagination = DefaultPagination } = params;
  const countQuery = sql`
    select count(*) as total
    from games g
    where if(${!!base_game_id}, base_game_id = ${base_game_id ?? -1}, true)
    and if(${!!base_game_slug}, slug = ${base_game_slug ?? ''}, true);
  `;
  const dataQuery = sql`
    select g.*,
      json_object(
        'portraits', (${groupImageByType('portrait')}),
        'landscapes', (${groupImageByType('landscape')}),
        'logos', json_array()
      ) as images
    from games g
    where if(${!!base_game_id}, g.base_game_id = ${base_game_id ?? -1}, true)
    and if(${!!base_game_slug}, g.slug = ${base_game_slug ?? ''}, true)
    and if(${!!keyword}, g.name like ${'%' + keyword + '%'}, true)
    limit ${pagination.limit} offset ${pagination.skip};
  `;

  const [dataRes, countRes] = await Promise.allSettled([
    query<
      (Game & {
        images: GameImageGroup;
      })[]
    >(dataQuery),
    querySingle<{ total: number }>(countQuery),
  ]);

  return {
    data: dataRes.status === 'fulfilled' ? dataRes.value.data : [],
    total: countRes.status === 'fulfilled' ? countRes.value.data?.total : 0,
  };
}
