import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Game, GameImageGroup } from "@/database/models";
import {
  Scroll,
  ScrollBulletIndicator,
  ScrollItem,
} from "@/components/scroll/index";

type SliderGame = Pick<
  Game,
  "ID" | "slug" | "name" | "developer" | "avg_rating"
> & {
  images: GameImageGroup;
};
export function HeroSlider({
  data,
  className = "",
}: {
  data: SliderGame[];
  className?: string;
}) {
  return (
    <>
      <ul
        id={"hero-slider"}
        className={
          "w-full flex gap-4 overflow-scroll scrollbar-hidden snap-x snap-mandatory " +
          className
        }
      >
        {data.map((item, index) => (
          <SliderItem key={item.ID} item={item} index={index} />
        ))}
      </ul>
      <ul className="flex w-full justify-center items-center gap-4 pt-4 md:hidden">
        {data.map((item, index) => {
          return (
            <li key={item.ID}>
              <ScrollBulletIndicator index={index} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

function SliderItem({ item }: { item: SliderGame; index: number }) {
  return (
    <ScrollItem
      as={"li"}
      className={
        "relative w-11/12 aspect-[9/11] flex-shrink-0 h-full snap-start rounded-xl overflow-hidden flex "
      }
    >
      <div className="intersect-point absolute left-1/2 top-1/2 bg-blue-200"></div>
      <Link href={"/" + item.slug} className="contents">
        <Image
          className="h-full w-full object-cover absolute"
          src={item.images.portrait?.url || ""}
          alt=""
          width={560}
          height={681}
        />
      </Link>
      <div
        className={
          "bg-gradient-to-t from-paper_3 via-40% via-paper_3/80 to-transparent " +
          " h-1/2  absolute w-full bottom-0 flex items-end " +
          " pointer-events-none"
        }
      ></div>
      <div className="h-max w-full grid gap-x-4 [grid-template-columns:max-content_auto] p-4 mt-auto relative">
        <div
          className={
            "relative w-16 flex items-center " +
            " before:absolute before:inset-0 before:rounded-lg before:bg-white/20 before:backdrop-blur-md p-1 " +
            " row-span-2 min-w-0 "
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
                className={"text-sm text-white_primary whitespace-nowrap w-max"}
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
  );
}
