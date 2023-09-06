import Carousel from "@/components/discover/Carousel";
import Link from "next/link";
import HeroCarousel from "@/components/home/hero_carousel/HeroCarousel";
import Image from "next/image";
import { Pillar } from "@/components/home/pillar";
import { HeroSlider } from "@/components/home/hero-slider";
import React from "react";
import { testServerAction } from "@/actions/test";
import { HoverPlayVideo } from "@/components/HoverPlayVideo";
import { connectDB, sql } from "./layout";

export default async function Home() {
  // const data: any[] = await getCollections([
  //   "top+sale",
  //   "new+release",
  //   "most+popular",
  //   "recently+update",
  // ]);
  // data[0].list_game.push(data[1].list_game[7]);
  // const _data = [
  //   {
  //     name: "Sample",
  //     _id: 1,
  //     list_game: data,
  //   },
  // ];
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
          g.sale_price, 'developer', g.developer, 'avg_rating', avg_rating,
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
  ) cd on c.ID = cd.collection_id;
`);

  const getImages = (images: any[]) => {
    const landscape = images.find((img) => {
      const type = img.type.toLowerCase();
      return (
        type.includes("landscape") ||
        type.includes("carousel") ||
        type.includes("wide")
      );
    });
    const portrait = images.find((img) => {
      const type = img.type.toLowerCase();
      return (
        type.includes("portrait") ||
        type.includes("thumbnail") ||
        type.includes("tall")
      );
    });
    const logo = images.find((img) => img.type.toLowerCase().includes("logo"));
    return {
      landscape,
      portrait,
      logo,
    };
  };
  // console.log(
  //   result[0][0].list_game.map((g) => {
  //     return {
  //       ...g,
  //       images: getImages(g.images),
  //     };
  //   })
  // );
  const data = result[0].map((d) => ({
    ...d,
    list_game: d.list_game.map((g) => {
      return {
        ...g,
        images: getImages(g.images),
      };
    }),
  }));
  console.log(data[0]);

  return (
    <>
      <HeroCarousel
        data={data[0].list_game.slice(0, 6)}
        className="hidden md:block"
      />
      <HeroSlider data={data[0]} className="md:hidden" />
      <hr className="my-4 border-default" />
      {data.slice(0, 1).map((collection: any, index: number) => (
        <Carousel
          key={index}
          collection={collection}
          className="pb-8 relative"
        />
      ))}
      <hr className="my-4 border-default" />
      {/* <section> */}
      {/*   <ul className={"flex gap-8"}> */}
      {/*     {data[0].list_game.filter(item => item.videos.length > 0).slice(6, 9).map((item) => { */}
      {/*       return ( */}
      {/*         <HoverPlayVideo item={item} /> */}
      {/*       ); */}
      {/*     })} */}
      {/*   </ul> */}
      {/* </section> */}
      <hr className="my-6 border-default" />
      {/* <div></div> */}
      {/* <section className="md:flex gap-8 w-[calc(100%_+_8px)] -translate-x-2"> */}
      {/*   <Pillar data={data.find((c) => c.name === "top sale")} /> */}
      {/*   <hr className="my-4 border-default md:hidden" /> */}
      {/*   <Pillar data={data.find((c) => c.name === "most popular")} /> */}
      {/*   <hr className="my-4 border-default md:hidden" /> */}
      {/*   <Pillar data={data.find((c) => c.name === "new release")} /> */}
      {/* </section> */}
      {/* <section */}
      {/*   className={ */}
      {/*     "flex flex-col gap-8 relative rounded-lg p-4 overflow-hidden " + */}
      {/*     "after:absolute after:inset-0 after:rounded-lg after:bg-white/20 after:backdrop-blur-md" */}
      {/*   } */}
      {/* > */}
      {/*   {data.splice(0, 1).map((category: any, index) => ( */}
      {/*     <div className={"flex gap-8 z-[1] explore-carousel-row-go-left "}> */}
      {/*       {[ */}
      {/*         ...category.list_game.slice(0, 10), */}
      {/*         ...category.list_game.slice(0, 10), */}
      {/*       ].map((game: any) => ( */}
      {/*         <div */}
      {/*           className={ */}
      {/*             "relative flex-shrink-0 " + */}
      {/*             (index !== 0 ? "-translate-x-12 " : "") + */}
      {/*             (index === 2 ? "-translate-x-24 " : "") */}
      {/*             // " after:absolute after:inset-0 after:rounded-lg after:bg-white/20 after:backdrop-blur-md " */}
      {/*           } */}
      {/*         > */}
      {/*           <Image */}
      {/*             src={ */}
      {/*               game.images.find((img: any) => img.type === "landscape") */}
      {/*                 ?.url */}
      {/*             } */}
      {/*             width={80} */}
      {/*             height={80} */}
      {/*             alt={""} */}
      {/*             className={"rounded-lg object-cover aspect-square"} */}
      {/*           /> */}
      {/*         </div> */}
      {/*       ))} */}
      {/*     </div> */}
      {/*   ))} */}
      {/*   <Link */}
      {/*     href={"/browse"} */}
      {/*     className={ */}
      {/*       "z-[1] w-40 py-2 bg-white text-primary rounded mx-auto text-center" */}
      {/*     } */}
      {/*   > */}
      {/*     Explore more */}
      {/*   </Link> */}
      {/* </section> */}
    </>
  );
}
