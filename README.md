# Game reseller

A game reseller website inspired by the sleek and responsive design of the Epic Game Store. It's tailored to look and perform exceptionally well on desktops, mobile devices, tablets, and more. Browse our extensive game library effortlessly and discover your next gaming experience in style.

# Runing this project locally

```
git clone https://github.com/nick-cb/game-reseller.git
cd game-reseller
npm install
npm run dev
```

You also need to update .env file before run `npm run dev`

# Project goals

The following are some of the things I want to get a better understading in no particular order

- Test React Server Component (RSC)
  - Test data fetching in RSC
  - Test data fetching with `use`
  - Test how component composition work in RSC (server component, client component, share component...)
  - Test container - children pattern in rsc
  - Test new React 18 features such as transition, concurrent react, optimistic update...
- Test Next.js 13 features
  - New app router
  - Parallel Routes
  - Intercepting Routes
  - Server actions
- Test css features
  - Container query
  - Subgrid
  - Animations
  - Layers
- And more...

# Show cases

visit [game-reseller.vercel.app](https://game-reseller.vercel.app/) to try it yourself

<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2007.07.14.webm?alt=media&token=c895ce30-1f76-4315-9bd4-c7db7879a247" />
</video>

- Login modal render on the current layout using intercepting and parallel route
<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2007.45.57.webm?alt=media&token=adfd0166-e35b-4385-aea2-cd961beff20f" />
</video>

- Order modal and add to cart using server action
<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2007.27.55.webm?alt=media&token=1b3ef373-fed9-405f-8224-ada719999322" />
</video>

- Cart page and checkout modal with RSC and server action
<video controls width="100%">
    <source src="https://firebasestorage.googleapis.com/v0/b/web-shop-ban-game-next-13.appspot.com/o/Screen%20Recording%202023-10-24%20at%2008.57.17.webm?alt=media&token=efd160ff-99c3-4014-9eb3-412c8877951a" />
</video>


# useSyncExternalStore
1. Every time the `callback` is called, it will call `getSnapshot`, if the data return by `getSnapshot` is different than
the data of the previous `getSnapshot` call, then a render will be schedule for the component that associate with the `callback`.

2. Everything in subcribe function must be synchronously, meaning that everything will be block until subcribe function is
finished, includes rendering.

3. `getSnapshot` is called everytime the component render

```jsx
const ref = useRef(null);
const [state, setState] = useState(0);

useEffect(() => {
    function click() {
        setState(state + 1);
    }
    ref.current?.addEventListener('click', click);
    return () => {
        ref.current?.removeEventListener('click', click);
    }
}, [state]);

<button ref={ref}>Click {state}!</button>
```


```jsx
// outside component
let data = 0;
// outside component

const ref = useRef(null);
const state = useSyncExternalStore(useCallback(function(callback) {
    function click() {
        data + 1;
        callback();
    }
    ref.current?.addEventListener('click', click);
    return () => {
        ref.current?.removeEventListener('click', click);
    }
}, []), () => data, () => data);

<button ref={ref}>Click {state}!</button>
```


# Query pillar group

- This is my first attempt
```sql
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
  ) cd on c.ID = cd.collection_id where find_in_set(c.collection_key, ${key.join(',')});
```

- It probally won't run very fast because it need a lot of join with subqueries and get unnecessary data
and it indeed was slow, with a small set of data in local machine, it took avarage of 72.3ms to complete

- First, I try to remove unnecessary data select (videos)

```sql
select c.*,
       cd.game_list
from collections c
       left join (select collection_id,
                         json_arrayagg(
                             json_object(
                                 'ID', g.ID,
                                 'name', g.name,
                                 'slug', g.slug,
                                 'sale_price', g.sale_price,
                                 'developer', g.developer,
                                 'avg_rating', avg_rating,
                                 'images', g.images,
                                 'videos', json_array()
                             )
                         ) as game_list
                  from collection_details
                         left join (select games.*,
                                           json_arrayagg(
                                               json_object(
                                                   'ID', gi.ID,
                                                   'url', gi.url,
                                                   'type', gi.type,
                                                   'alt', gi.alt,
                                                   'row', gi.pos_row
                                               )
                                           ) as 'images'
                                    from games
                                           left join game_images gi on games.ID = gi.game_id and gi.type = 'portrait'
                                    group by games.ID
                                    ) g
                                   on collection_details.game_id = g.ID
                  group by collection_id) cd on c.ID = cd.collection_id
where find_in_set(c.collection_key, 'feature,most_played');
```

- That reduce about three nested left join and with abuch of aggregation and reduce the average query
time to about 30ms
- That is good, reduce by 50%, but i want more, if we run `explain analyse`, we can see that this query
still do many full table scan, on games and collection table, in this case, I think because of the full
table scan on the games table that cause the issue, cause it make outer aggregate more expensive
```
-> Nested loop left join  (cost=82.1 rows=36) (actual time=28.6..28.6 rows=2 loops=1)
    -> Filter: (0 <> find_in_set(c.collection_key,'feature,most_played'))  (cost=0.85 rows=6) (actual time=0.0454..0.0519 rows=2 loops=1)
        -> Table scan on c  (cost=0.85 rows=6) (actual time=0.0293..0.0435 rows=6 loops=1)
    -> Index lookup on cd using <auto_key0> (collection_id=c.ID)  (cost=12421..12435 rows=51.8) (actual time=14.3..14.3 rows=1 loops=2)
        -> Materialize  (cost=12421..12421 rows=6) (actual time=28.6..28.6 rows=6 loops=1)
            -> Group aggregate: json_arrayagg(json_object('ID',g.ID,'name',g.`name`,'slug',g.slug,'sale_price',g.sale_price,'developer',g.developer,'avg_rating',g.avg_rating,'images',g.images,'videos',json_array()))  (cost=12421 rows=6) (actual time=26.8..27.6 rows=6 loops=1)
                -> Nested loop left join  (cost=6864 rows=55566) (actual time=26.7..26.9 rows=126 loops=1)
                    -> Sort: collection_details.collection_id  (cost=12.9 rows=126) (actual time=0.139..0.144 rows=126 loops=1)
                        -> Index scan on collection_details using collection_details_game_id_collection_id_uindex  (cost=12.9 rows=126) (actual time=0.0499..0.079 rows=126 loops=1)
                    -> Index lookup on g using <auto_key0> (ID=collection_details.game_id)  (cost=2443..2453 rows=41.1) (actual time=0.212..0.212 rows=1 loops=126)
                        -> Materialize  (cost=2443..2443 rows=441) (actual time=26.6..26.6 rows=507 loops=1)
                            -> Group aggregate: json_arrayagg(json_object('ID',gi.ID,'url',gi.`url`,'type',gi.`type`,'alt',gi.alt,'row',gi.pos_row))  (cost=2398 rows=441) (actual time=1.58..20.5 rows=507 loops=1)
                                -> Nested loop left join  (cost=1881 rows=5178) (actual time=1.54..14.2 rows=1344 loops=1)
                                    -> Sort row IDs: games.ID  (cost=68.3 rows=441) (actual time=1.51..2.8 rows=507 loops=1)
                                        -> Table scan on games  (cost=68.3 rows=441) (actual time=0.0147..1.35 rows=507 loops=1)
                                    -> Filter: (gi.`type` = 'portrait')  (cost=2.94 rows=11.7) (actual time=0.00563..0.022 rows=2.65 loops=507)
                                        -> Index lookup on gi using game_id_index (game_id=games.ID)  (cost=2.94 rows=11.7) (actual time=0.00242..0.0196 rows=11.9 loops=507)
```
```
"-> Group aggregate: json_arrayagg(json_object('ID',g.ID,'name',g.`name`,'slug',g.slug,'sale_price',g.sale_price,'developer',g.developer,'avg_rating',g.avg_rating,'images',g.images))  (cost=12426 rows=6) (actual time=27.4..27.6 rows=2 loops=1)
    -> Nested loop left join  (cost=6869 rows=55566) (actual time=27.2..27.3 rows=39 loops=1)
        -> Nested loop left join  (cost=18 rows=126) (actual time=0.0917..0.112 rows=39 loops=1)
            -> Sort: c.ID  (cost=0.85 rows=6) (actual time=0.0498..0.0505 rows=2 loops=1)
                -> Filter: (0 <> find_in_set(c.collection_key,'feature,most_played'))  (cost=0.85 rows=6) (actual time=0.0351..0.0394 rows=2 loops=1)
                    -> Table scan on c  (cost=0.85 rows=6) (actual time=0.0289..0.0334 rows=6 loops=1)
            -> Index lookup on cd using collection_details_collection_id_index (collection_id=c.ID)  (cost=1.1 rows=21) (actual time=0.0225..0.0296 rows=19.5 loops=2)
        -> Index lookup on g using <auto_key0> (ID=cd.game_id)  (cost=2443..2453 rows=41.1) (actual time=0.697..0.697 rows=1 loops=39)
            -> Materialize  (cost=2443..2443 rows=441) (actual time=27.1..27.1 rows=507 loops=1)
                -> Group aggregate: json_arrayagg(json_object('ID',gi.ID,'url',gi.`url`,'type',gi.`type`,'alt',gi.alt,'row',gi.pos_row))  (cost=2398 rows=441) (actual time=1.13..21.2 rows=507 loops=1)
                    -> Nested loop left join  (cost=1881 rows=5178) (actual time=1.08..14.3 rows=1344 loops=1)
                        -> Sort row IDs: g.ID  (cost=68.3 rows=441) (actual time=1.05..2.44 rows=507 loops=1)
                            -> Table scan on g  (cost=68.3 rows=441) (actual time=0.0398..0.947 rows=507 loops=1)
                        -> Filter: (gi.`type` = 'portrait')  (cost=2.94 rows=11.7) (actual time=0.00583..0.0231 rows=2.65 loops=507)
                            -> Index lookup on gi using game_id_index (game_id=g.ID)  (cost=2.94 rows=11.7) (actual time=0.0025..0.0204 rows=11.9 loops=507)
"
```
- Let's try to reduce the number of rows return from the `games` table scan, because we don't need 441 rows to be returnted when we only need at most
10 game for each collection
    - My first idea is to somehow limit the number of `games` rows returned for each collection by usinng `row_number()` and `partition` to give each row
    an ordered index
    ```sql
    select *
    from games as g
    left join (
      select *,
              row_number() over (partition by game_id order by ID) as rn
      from game_images
      where type = 'portrait'
    ) as gi on g.ID = gi.game_id and rn < 2;
    ```
    But it turn out to be not a good solution, in order to assign the correct order for each row, mysql will have to do a whole table scan instead of unique
    index scan, result in the query to be more expensive, here is the explain analyse result of above query
    ```
    1   -> Nested loop left join  (cost=1766 rows=4851) (actual time=15.6..18.3 rows=507 loops=1)
    2       -> Table scan on g  (cost=68.3 rows=441) (actual time=0.345..1.96 rows=507 loops=1)
    3       -> Filter: (gi.rn < 2)  (cost=0.25..2.75 rows=11) (actual time=0.0311..0.032 rows=1 loops=507)
    4           -> Index lookup on gi using <auto_key0> (game_id=g.ID)  (cost=0.25..2.75 rows=11) (actual time=0.031..0.0316 rows=2.65 loops=507)
    5               -> Materialize  (cost=0..0 rows=0) (actual time=15.2..15.2 rows=1344 loops=1)
    6                   -> Window aggregate: row_number() OVER (PARTITION BY game_images.game_id ORDER BY game_images.ID )   (actual time=10.1..13.1 rows=1344 loops=1)
    7                       -> Sort row IDs: game_images.game_id, game_images.ID  (cost=636 rows=5953) (actual time=10.1..12.1 rows=1344 loops=1)
    8                           -> Filter: (game_images.`type` = 'portrait')  (cost=636 rows=5953) (actual time=0.071..9.48 rows=1344 loops=1)
    9                               -> Table scan on game_images  (cost=636 rows=5953) (actual time=0.0557..8.5 rows=6035 loops=1)
    ```
    Compare to this query without using `row_number()`
    ```sql
    select *
    from games as g
           left join (
      select *
      from game_images
      where type = 'portrait'
    ) as gi on g.ID = gi.game_id;
    ```
    ```
    1 -> Nested loop left join  (cost=1881 rows=5178) (actual time=0.201..24.1 rows=1344 loops=1)
    2   -> Table scan on g  (cost=68.3 rows=441) (actual time=0.0637..2.93 rows=507 loops=1)
    3   -> Filter: (game_images.`type` = 'portrait')  (cost=2.94 rows=11.7) (actual time=0.00734..0.0408 rows=2.65 loops=507)
    4       -> Index lookup on game_images using game_id_index (game_id=g.ID)  (cost=2.94 rows=11.7) (actual time=0.00318..0.0382 rows=11.9 loops=507)
    ```
    We can see that the query with `row_number()` have to do more works to get the correct row number `rows=11` (line 4) compare to the query without
    it at line 3
- The first optimized query still use more subqueries thant we actually need

```
"-> Group aggregate: json_arrayagg(tmp_field)  (actual time=24.6..24.6 rows=2 loops=1)
    -> Sort: cd.collection_id  (actual time=24.5..24.5 rows=14 loops=1)
        -> Stream results  (cost=47075 rows=333396) (actual time=24.4..24.5 rows=14 loops=1)
            -> Nested loop left join  (cost=47075 rows=333396) (actual time=24.4..24.4 rows=14 loops=1)
                -> Nested loop inner join  (cost=143 rows=756) (actual time=0.367..0.392 rows=14 loops=1)
                    -> Nested loop inner join  (cost=20.2 rows=36) (actual time=0.292..0.299 rows=2 loops=1)
                        -> Filter: ((0 <> find_in_set(c.collection_key,'feature,most_played')) and (c.ID is not null))  (cost=0.85 rows=6) (actual time=0.0429..0.0479 rows=2 loops=1)
                            -> Table scan on c  (cost=0.85 rows=6) (actual time=0.0365..0.0402 rows=6 loops=1)
                        -> Index lookup on group_max using <auto_key0> (collection_id=c.ID)  (cost=26.3..28.9 rows=10.5) (actual time=0.125..0.125 rows=1 loops=2)
                            -> Materialize  (cost=26.1..26.1 rows=6) (actual time=0.245..0.245 rows=6 loops=1)
                                -> Group aggregate: group_concat(collection_details.game_id order by collection_details.game_id DESC separator ',')  (cost=25.5 rows=6) (actual time=0.133..0.201 rows=6 loops=1)
                                    -> Index scan on collection_details using collection_details_collection_id_index  (cost=12.9 rows=126) (actual time=0.124..0.167 rows=126 loops=1)
                    -> Filter: (find_in_set(cd.game_id,group_max.game_ids) <= 10)  (cost=0.783 rows=21) (actual time=0.0406..0.0458 rows=7 loops=2)
                        -> Index lookup on cd using collection_details_collection_id_index (collection_id=c.ID)  (cost=0.783 rows=21) (actual time=0.0153..0.026 rows=19.5 loops=2)
                -> Index lookup on g using <auto_key0> (ID=cd.game_id)  (cost=2443..2453 rows=41.1) (actual time=1.72..1.72 rows=1 loops=14)
                    -> Materialize  (cost=2443..2443 rows=441) (actual time=24..24 rows=507 loops=1)
                        -> Group aggregate: min(gi.ID)  (cost=2398 rows=441) (actual time=0.105..19.5 rows=507 loops=1)
                            -> Nested loop left join  (cost=1881 rows=5178) (actual time=0.0567..15.1 rows=1344 loops=1)
                                -> Index scan on g using PRIMARY  (cost=68.3 rows=441) (actual time=0.0198..1.62 rows=507 loops=1)
                                -> Filter: (gi.`type` = 'portrait')  (cost=2.94 rows=11.7) (actual time=0.0183..0.0261 rows=2.65 loops=507)
                                    -> Index lookup on gi using game_id_index (game_id=g.ID)  (cost=2.94 rows=11.7) (actual time=0.017..0.0239 rows=11.9 loops=507)
"
```
