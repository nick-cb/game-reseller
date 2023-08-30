import React from "react";
import Image from "next/image";
import StandardButton from "@/components/StandardButton";
import ReactMarkdown from "react-markdown";
import { getLoggedInStatus } from "@/actions/users";
import { redirect } from "next/navigation";
import remarkBreaks from "remark-breaks";
import ExpandableDescription from "@/components/ExpandableDescription";
import GameCard from "@/components/game/GameCard";
import LinearCarousel from "@/components/game/LinearCarousel";
import Link from "next/link";
import { connectDB, sql } from "../layout";
import rehypeRaw from "rehype-raw";

const page = async ({ params }: { params: any }) => {
  const { slug } = params;
  const db = await connectDB();
  const response = await db.execute(sql`
select 
  *, 
  gi.images, 
  if(
    v.videos is null, 
    json_array(), 
    v.videos
  ) as videos, 
  s.systems as systems, 
  td.tags as tags, 
  r.reviews as reviews, 
  p.polls as polls 
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
                  'ID', ID, 'key', media_key, 'content_type', 
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
  left join (
    select 
      s.game_id, 
      json_arrayagg(
        json_object(
          'ID', s.ID, 'os', s.os, 'details', sd.details
        )
      ) as systems 
    from 
      systems s 
      left join (
        select 
          system_id, 
          json_arrayagg(
            json_object(
              'ID', sd.ID, 'title', sd.title, 'minimum', 
              sd.minimum, 'recommended', sd.recommended
            )
          ) as details 
        from 
          system_details sd 
        group by 
          system_id
      ) sd on s.ID = sd.system_id 
    group by 
      game_id
  ) s on games.ID = s.game_id 
  left join (
    select 
      tag_details.game_id, 
      json_arrayagg(
        json_object(
          'ID', t.ID, 'name', t.name, 'group_name', 
          t.group_name
        )
      ) as tags 
    from 
      tag_details 
      join tags t on tag_details.tag_id = t.ID 
    group by 
      game_id
  ) td on td.game_id = s.game_id 
  left join (
    select 
      game_id, 
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
    from 
      reviews 
    group by 
      game_id
  ) r on games.ID = r.game_id 
  left join (
    select 
      game_id, 
      json_arrayagg(
        json_object(
          'ID', polls.ID, 'text', polls.text, 
          'result_title', polls.result_title, 
          'result_text', polls.result_text, 
          'result_emoji', polls.result_emoji, 
          'emoji', polls.emoji
        )
      ) as polls 
    from 
      polls 
    group by 
      game_id
  ) p on games.ID = p.game_id 
where 
  slug = '${slug}';
`);
  const game = response[0][0];
  const mappingResponse = await db.execute(sql`
select *, gi.images
from games
         left join (select game_id,
                           json_arrayagg(json_object('ID', gi.ID, 'type', gi.type, 'pos_row', gi.pos_row, 'alt', gi.alt,
                                                     'url', gi.url)) as images
                    from game_images gi
                    group by game_id) gi on games.ID = gi.game_id
where base_game_id = ${game.type === "base_game" ? game.ID : game.base_game_id};
`);
  console.log({ game });
  console.log({ mapping: mappingResponse[0] });
  const editions = mappingResponse[0].filter((g) => g.type.includes("edition"));
  const dlc = mappingResponse[0].filter((g) => g.type.includes("dlc"));
  const addOns = mappingResponse[0].filter((g) => g.type.includes("add_on"));
  const dlcAndAddons = dlc.concat(addOns);

  const landscapeImages = game.images.reduce((acc: any[], curr: any) => {
    const type = curr.type.toLowerCase();
    if (
      (type.includes("wide") ||
        type.includes("carousel") ||
        type.includes("feature")) &&
      !type.includes("video")
    ) {
      const segments = curr.url.split("-");
      const id = segments[segments.length - 1];
      if (acc.some((item) => item.url.includes(id))) {
        return acc;
      }
      acc.push(curr);
      return acc;
    }
    return acc;
  }, []);

  const buyNow = async () => {
    "use server";
    const status = await getLoggedInStatus();
    if (!status) {
      redirect(`/login?gameId=${game.ID}`);
    }
    redirect(`/${game.ID}/order`);
  };
  return (
    <div className="pt-6">
      <h1 className="text-2xl text-white_primary pb-6">{game.name}</h1>
      <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 grid-rows-[min-content_auto] gap-4 md:gap-8 lg:gap-16">
        <section className="[grid-column:-3/1] row-start-1 row-end-2">
          <LinearCarousel videos={game.videos} images={landscapeImages} />
        </section>
        <section
          className="w-full 
          row-start-3 md:row-start-1 sm:row-end-4 
          col-span-3 md:[grid-column:-1/-3] md:col-start-3 md:col-end-4"
        >
          <div className="flex flex-col gap-4 md:sticky top-[116px]">
            <div className="relative w-full aspect-[3/2] hidden md:block">
              <Image
                src={
                  game.images.find((img: any) => {
                    return img.type.toLowerCase().includes("logo");
                  })?.url
                }
                fill
                alt={`logo of ${game.name}`}
                className="object-contain"
              />
            </div>
            {/* <p className="text-xs bg-yellow-300 text-default px-2 py-1 w-max rounded"> */}
            {/*   {game.included_in.length > 0 ? "Add-on" : "Base game"} */}
            {/* </p> */}
            <p className="text-white_primary">
              {game.sale_price > 0 ? "$" + game.sale_price : "Free"}
            </p>
            <div className="flex flex-col gap-2">
              <form action={buyNow}>
                <StandardButton type="submit" className="text-sm">
                  BUY NOW
                </StandardButton>
              </form>
              <button
                className="text-sm py-2 w-full rounded border
                border-white/60 text-white hover:bg-paper transition-colors"
              >
                Add to cart
              </button>
            </div>
            <div className="text-white text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <p className="text-white/60">Developer</p>
                <p className="text-white_primary">{game.developer}</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <p className="text-white/60">Publisher</p>
                <p className="text-white_primary">{game.publisher}</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <p className="text-white/60">Release Date</p>
                <p className="text-white_primary">
                  {new Date(game.release_date).toLocaleDateString()}
                </p>
              </div>
              {/* <div className="flex justify-between items-center py-2 border-b border-white/20"> */}
              {/*   <p className="text-white/60">Platform</p> */}
              {/*   <p className="text-white_primary"> */}
              {/*     {(Object.keys(game.requirements?.systems) || []).map( */}
              {/*       (system) => system */}
              {/*     )} */}
              {/*   </p> */}
              {/* </div> */}
            </div>
          </div>
        </section>
        <section className="col-span-full md:[grid-column:-3/1]">
          <summary className="text-sm sm:text-base list-none text-white_primary">
            {game.description}
          </summary>
          <div className="flex gap-8 justify-between">
            <div className="border-l border-white/60 pl-4 py-3 mt-4 w-full">
              <p className="text-sm text-white/60">Genres</p>
              <p className="text-white text-sm">
                {game.tags
                  .filter((tag) => tag.group_name === "genre")
                  .map(
                    (tag: any) =>
                      tag.name[0].toUpperCase() + tag.name.substring(1)
                  )
                  .join(", ")}
              </p>
            </div>
            <div className="border-l border-white/60 pl-4 py-3 mt-4 w-full">
              <p className="text-sm text-white/60">Features</p>
              <p className="text-white text-sm">
                {game.tags
                  .filter((tag) => tag.group_name === "feature")
                  .map(
                    (tag: any) =>
                      tag.name[0].toUpperCase() + tag.name.substring(1)
                  )
                  .join(", ")}
              </p>
            </div>
          </div>
        </section>
        <section className="col-span-full md:[grid-column:-3/1]">
          <ExpandableDescription>
            <article className="text-sm text-white_primary/60 hover:text-white_primary/80 transition-colors">
              <ReactMarkdown
                components={{ p: "div", h1: "h2" }}
                className="description-container"
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
              >
                {game.long_description}
              </ReactMarkdown>
            </article>
          </ExpandableDescription>
        </section>
        {editions.length > 0 ? (
          <>
            <section className="col-start-1 col-span-full xl:[grid-column:-3/1]">
              <h2 className="text-xl text-white_primary pb-4">Editions</h2>
              {editions.map((edition: any) => (
                <>
                  <div className="flex flex-col gap-4">
                    <GameCard game={edition} type="edition" />
                  </div>
                  <br className="last:hidden" />
                </>
              ))}
            </section>
          </>
        ) : null}
        {dlcAndAddons.length > 0 ? (
          <>
            <section className="col-start-1 col-span-full xl:[grid-column:-3/1]">
              <h2 className="text-xl text-white_primary pb-4">Add-ons</h2>
              {dlcAndAddons.slice(0, 3).map((edition: any) => (
                <>
                  <div className="flex flex-col gap-4">
                    <GameCard game={edition} type="add-on" />
                  </div>
                  <br className="last:hidden" />
                </>
              ))}
              {dlcAndAddons.length > 3 ? (
                <Link
                  href={"#"}
                  className="w-full text-center py-4 block rounded text-sm
                  border border-white_primary/60 
                  hover:bg-paper transition-colors"
                >
                  See more
                </Link>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default page;
