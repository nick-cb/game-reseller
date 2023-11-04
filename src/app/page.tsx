import Carousel from "@/components/discover/Carousel";
import HeroCarousel from "@/components/home/hero_carousel/HeroCarousel";
import { Pillar } from "@/components/home/pillar";
import { HeroSlider } from "@/components/home/hero-slider";
import React from "react";
import { FeatureCard } from "@/components/HoverPlayVideo";
import { groupImages } from "@/utils/data";
import { getCollectionByKey } from "@/actions/collections";
import { getHeroCarousel } from "@/actions/homepage";
import { ScrollItem, Scroll, ScrollButton } from "@/components/scroll/index";
import Image from "next/image";
import {Description} from "@/components/home/hero_carousel/Description";
import {Cover} from "@/components/home/hero_carousel/Cover";
import {ButtonGroup} from "@/components/home/hero_carousel/ButtonGroup";

export default async function Home() {
  // TODO: Using transaction
  // TODO: Save page configuration on db
  const [
    { data: heroCarousel },
    {
      data: [topSale],
    },
    {
      data: [feature],
    },
    { data: pillars },
  ] = await Promise.all([
    getHeroCarousel(),
    getCollectionByKey(["top_sale"]),
    getCollectionByKey(["feature"]),
    getCollectionByKey(["new_release", "most_played", "top_player_rated"]),
  ]);
  const carouselListGame =
    heroCarousel?.list_game.map((game) => {
      return {
        ...game,
        images: groupImages(game.images),
      };
    }) || [];

  return (
    <>
      <HeroCarousel data={carouselListGame || []} className="hidden sm:block">
        {carouselListGame.map((item, idx) => (
          <li
            key={item.ID}
            className={
              "main-item snap-start "
              // (idx === 0
              //   ? index === -1 || index === 0
              //     ? "z-[1]"
              //     : ""
              //   : index === idx
              //   ? "z-[1]"
              //   : "")
            }
          >
            {item.images.landscape?.url && (
              <Image
                className="rounded-lg object-cover h-full w-full"
                src={decodeURIComponent(item.images.landscape.url)}
                alt=""
                width={1280}
                height={720}
                // priority
                // loading="eager"
              />
            )}
            <Cover>
              <ButtonGroup game={item} />
              <Description game={item} />
            </Cover>
          </li>
        ))}
      </HeroCarousel>
      <Scroll containerSelector="#hero-slider">
        <HeroSlider data={carouselListGame || []} className="sm:hidden" />
      </Scroll>
      <hr className="my-4 border-default" />
      <Scroll
        containerSelector={
          "#" + topSale?.collection_key + "-mobile-scroll-list"
        }
      >
        {topSale ? (
          <section className="pb-8 relative">
            <ScrollButton method={"scrollToNextOffView"} direction="left">
              <svg
                fill={"transparent"}
                // stroke={
                //   elements[0]?.isIntersecting
                //     ? "rgb(255 255 255 / 0.25)"
                //     : "rgb(255 255 255)"
                // }
                stroke="rgb(255 255 255 / 0.25)"
                className="-rotate-90 w-[32px] h-[32px]"
              >
                <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
              </svg>
            </ScrollButton>
            <ScrollButton method={"scrollToNextOffView"} direction="right">
              <svg
                fill={"transparent"}
                stroke="rgb(255 255 255 / 0.25)"
                // stroke={
                //   elements.at(-1)?.isIntersecting
                //     ? "rgb(255 255 255 / 0.25)"
                //     : "rgb(255 255 255)"
                // }
                className="rotate-90 w-[32px] h-[32px]"
              >
                <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
              </svg>
            </ScrollButton>
            <Carousel
              collection={{
                ...topSale,
                list_game: topSale.list_game.map((game) => {
                  return {
                    ...game,
                    images: groupImages(game.images),
                  };
                }),
              }}
            />
          </section>
        ) : null}
      </Scroll>
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
                  <ScrollItem
                    as="li"
                    key={item.ID}
                    className="sm:w-full group cursor-pointer w-4/5 flex-shrink-0 sm:flex-shrink snap-center first-of-type:snap-start"
                  >
                    <FeatureCard
                      key={item.ID}
                      item={{ ...item, images: groupImages(item.images) }}
                    />
                  </ScrollItem>
                );
              })}
            </ul>
          </section>
        </Scroll>
      ) : null}
      <hr className="my-6 border-default" />
      <section className="md:flex gap-8 w-[calc(100%_+_8px)] -translate-x-2">
        {pillars.map((collection) => {
          if (!collection) {
            return null;
          }
          return (
            <React.Fragment key={collection.ID}>
              <Pillar
                data={{
                  ...collection,
                  list_game: collection.list_game.map((game) => {
                    return {
                      ...game,
                      images: groupImages(game.images),
                    };
                  }),
                }}
              />
              <hr className="my-4 border-default md:hidden last-of-type:hidden" />
            </React.Fragment>
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
