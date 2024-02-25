import "./hero-carousel.css";
import Image from "next/image";
import React, { PropsWithChildren } from "react";
import {
  Description,
  HeroCarouselGame,
} from "@/features/homepage/hero_carousel/Description";
import { Scroll, ScrollBulletIndicator, ScrollItem } from "@/components/scroll";
import { Carousel, Indicator, IndicatorList } from "./Carousel";
import { ButtonGroup } from "./ButtonGroup";
import { Cover } from "./Cover";
import { getHeroCarousel } from "@/features/homepage/hero_carousel/HeroCarousel.action";
import { groupImages } from "@/utils/data";

type HeroCarouselProps = {
  className?: string;
};
export async function HeroCarousel({
  className = "",
}: PropsWithChildren<HeroCarouselProps>) {
  const { data: heroCarousel = { list_game: [] } } = await getHeroCarousel();
  const data = heroCarousel.list_game.map((game) => {
    return {
      ...game,
      images: groupImages(game.images),
    };
  });

  return (
    <div className={"sm:flex gap-4 lg:gap-8 " + className}>
      <Carousel
        length={data.length}
        Indicator={
          <>
            <MobileIndicator data={data} />
            <DesktopIndicator data={data} />
          </>
        }
      >
        {data.map((item, index) => (
          <ScrollItem
            key={item.ID}
            as="li"
            className={
              "relative main-item snap-start " +
              "flex-shrink-0 rounded-xl overflow-hidden flex " +
              "w-11/12 sm:w-full"
            }
          >
            <picture>
              <source
                media="(min-width:640px)"
                srcSet={
                  decodeURIComponent(item.images.landscape.url) +
                  "?h=900&quality=medium&resize=1&w=1440"
                }
                width={1280}
                height={720}
                className="object-cover"
              />
              <img
                srcSet={
                  decodeURIComponent(item.images.portrait.url) +
                  "?h=850&quality=medium&resize=1&w=640"
                }
                width={640}
                height={850}
                className="rounded-lg object-cover w-full h-full"
                loading={index < 2 ? "eager" : "lazy"}
              />
            </picture>
            <Cover className="hidden sm:flex">
              <ButtonGroup game={item} />
              <Description game={item} />
            </Cover>
            <div
              className={
                "bg-gradient-to-t from-paper_3 via-40% via-paper_3/80 to-transparent " +
                " h-1/2  absolute w-full bottom-0 flex items-end " +
                " pointer-events-none sm:hidden"
              }
            ></div>
            <div className="h-max w-full grid gap-x-4 [grid-template-columns:max-content_auto] p-4 mt-auto absolute bottom-0 sm:hidden">
              <div
                className={
                  "relative w-16 flex items-center " +
                  "before:absolute before:inset-0 before:rounded-lg before:bg-white/20 before:backdrop-blur-md p-1 " +
                  "row-span-2 min-w-0 "
                }
              >
                <Image
                  src={item.images.logo?.url || ""}
                  alt=""
                  width={56}
                  height={56}
                  className="rounded w-14 h-14 object-contain block relative"
                  priority
                />
              </div>
              <div
                className={
                  "col-start-2 col-end-3 relative " +
                  " min-w-0 w-[calc(100%+16px)] overflow-hidden "
                }
              >
                <Scroll
                  containerSelector={
                    "#" + item.slug.replace("/", "-") + "-infinite-scroll-text"
                  }
                  infiniteScroll
                  observerOptions={{
                    threshold: 1,
                  }}
                >
                  <div
                    id={item.slug.replace("/", "-") + "-infinite-scroll-text"}
                    className="flex gap-10"
                  >
                    <ScrollItem
                      as={"p"}
                      className={
                        "text-sm text-white_primary whitespace-nowrap w-max"
                      }
                    >
                      {item.name}
                    </ScrollItem>
                  </div>
                </Scroll>
              </div>
              <div className="flex justify-between min-w-0">
                <div>
                  <p className={"text-xs text-white_primary/60 mb-1"}>
                    {item.developer}
                  </p>
                  <p
                    className={
                      "text-xs text-white_primary/60 flex items-center gap-[0.5ch]"
                    }
                  >
                    <svg
                      fill="none"
                      stroke="hsl(0 0% 96% / 0.6)"
                      width={14}
                      height={14}
                      className={"-translate-y-[1px]"}
                    >
                      <use
                        strokeWidth={3}
                        xlinkHref="/svg/sprites/actions.svg#star"
                      />
                    </svg>
                    {item.avg_rating?.toString().split(".")[0] +
                      "." +
                      item.avg_rating?.toString().split(".")[1].substring(0, 1)}
                  </p>
                </div>
                <button className="text-sm px-4 py-2 bg-white rounded text-default">
                  Buy now
                </button>
              </div>
            </div>
          </ScrollItem>
        ))}
      </Carousel>
    </div>
  );
}

function MobileIndicator({ data }: { data: HeroCarouselGame[] }) {
  return (
    <ul className="flex w-full justify-center items-center gap-4 pt-4 sm:hidden">
      {data.map((item, index) => {
        return (
          <li key={item.ID}>
            <ScrollBulletIndicator index={index} />
          </li>
        );
      })}
    </ul>
  );
}

function DesktopIndicator({ data }: { data: HeroCarouselGame[] }) {
  return (
    <IndicatorList className="sm:flex flex-col gap-2 flex-1 hidden">
      {data.map((item, itemIndex) => (
        <Indicator
          key={item.ID}
          index={itemIndex}
          className="hero-carousel-preview-item w-full h-full relative rounded-xl overflow-hidden
            after:absolute after:inset-0 hover:bg-paper_2 after:bg-paper"
          title={item.name}
        >
          <div
            className="flex items-center gap-4 h-full w-full focus:bg-paper_2 p-2 lg:p-3"
            // href="#"
          >
            <div className="relative h-full shrink-0 aspect-[0.75] rounded-lg overflow-hidden z-[1]">
              {item.images.portrait?.url && (
                <Image
                  alt=""
                  className="absolute"
                  src={decodeURIComponent(item.images.portrait.url)}
                  width={54}
                  height={72}
                />
              )}
            </div>
            <p className="text-sm text-white_primary z-[1] line-clamp-2">
              {item.name}
            </p>
          </div>
        </Indicator>
      ))}
    </IndicatorList>
  );
}

export default HeroCarousel;
