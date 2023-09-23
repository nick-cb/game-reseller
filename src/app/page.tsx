import Carousel from "@/components/discover/Carousel";
import HeroCarousel from "@/components/home/hero_carousel/HeroCarousel";
import { Pillar } from "@/components/home/pillar";
import { HeroSlider } from "@/components/home/hero-slider";
import React from "react";
import { FeatureCard, FeatureCardItem } from "@/components/HoverPlayVideo";
import Scroll, { Item } from "@/components/Scroll";
import { getCollectionByKey } from "@/database/repository/collection/select";
import { groupImages } from "@/utils/data";

export default async function Home() {
  const result = await getCollectionByKey([
    "top_sale",
    "feature",
    "new_release",
    "most_played",
    "top_player_rated",
  ]);
  const data = result[0].map((collection) => ({
    ...collection,
    list_game: collection.list_game.map((g) => {
      return {
        ...g,
        images: groupImages(g.images),
      };
    }),
  }));
  const featureIndex = data.findIndex(
    (collection) => collection.collection_key === "feature",
  );
  const feature = data.splice(featureIndex, 1)[0];

  return (
    <>
      <HeroCarousel
        data={data[0].list_game.slice(0, 6)}
        className="hidden sm:block"
      />
      <Scroll containerSelector="#hero-slider">
        <HeroSlider data={data[0].list_game.slice(0, 6)} className="sm:hidden" />
      </Scroll>
      <hr className="my-4 border-default" />
      {data.slice(0, 1).map((collection, index) => (
        <Scroll
          containerSelector={
            "#" + collection.collection_key + "-mobile-scroll-list"
          }
        >
          <Carousel
            key={index}
            collection={collection}
            className="pb-8 relative"
          />
        </Scroll>
      ))}
      <hr className="my-4 border-default" />
      {feature ? (
        <Scroll containerSelector="#feature-mobile-scroll-list">
          <section>
            <ul
              id={"feature-mobile-scroll-list"}
              className={
                "flex gap-8 overflow-scroll scrollbar-hidden snap-x snap-mandatory"
              }
            >
              {feature?.list_game.slice(0, 3).map((item) => {
                return (
                  <Item
                    as="li"
                    className="sm:w-full group cursor-pointer w-4/5 flex-shrink-0 sm:flex-shrink snap-center first-of-type:snap-start"
                  >
                    <FeatureCard key={item.ID} item={item as FeatureCardItem} />
                  </Item>
                );
              })}
            </ul>
          </section>
        </Scroll>
      ) : null}
      <hr className="my-6 border-default" />
      <section className="md:flex gap-8 w-[calc(100%_+_8px)] -translate-x-2">
        {data.slice(1).map((collection) => {
          return (
            <>
              <Pillar data={collection} />
              <hr className="my-4 border-default md:hidden last-of-type:hidden" />
            </>
          );
        })}
      </section>
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
