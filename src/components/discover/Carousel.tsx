"use client";

import React, { useMemo, useRef } from "react";
import PortraitGameCard from "../PortraitGameCard";
import Link from "next/link";
import { Collections, Game, GameImageGroup } from "@/database/models";
import { FVideoFullInfo } from "@/actions/game/select";
import { useScroll } from "@/components/scroll/hook";

type CarouselGame = Pick<
  Game,
  | "ID"
  | "name"
  | "slug"
  | "developer"
  | "avg_rating"
  | "sale_price"
  | "description"
> & {
  images: GameImageGroup;
  videos: FVideoFullInfo[];
};
type CarouselProps = {
  collection: Collections & {
    list_game: CarouselGame[];
  };
};

const Carousel = ({ collection }: CarouselProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);
  const { elements, scrollToIndex } = useScroll();
  const { firstItemInView, lastItemInView } = useMemo(() => {
    const firstItemInViewIdx = elements.findIndex((el) => el.isIntersecting);
    const lastItemInViewIdx =
      elements.findIndex(
        (el, index) => !el.isIntersecting && index > firstItemInViewIdx,
      ) - 1;
    return {
      firstItemInView: {
        index: firstItemInViewIdx,
        element: elements[firstItemInViewIdx],
      },
      lastItemInView: {
        index: lastItemInViewIdx,
        element: elements[lastItemInViewIdx],
      },
    };
  }, [elements]);

  return (
    <>
      <div className={"flex justify-between mb-4"}>
        <Link
          className="text-white text-lg flex items-center group gap-2 w-max pr-4"
          href={`/browse?collection=${collection.collection_key}`}
        >
          {collection.name[0].toUpperCase() + collection.name.substring(1)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16px"
            height="16px"
            className="group-hover:translate-x-2 transition-transform"
          >
            <g id="Icon">
              <path
                fill="white"
                d="M5.53,16.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
                className="transition-colors"
              />
            </g>
          </svg>
        </Link>
        <div className={"flex items-center gap-2"}>
          <button
            ref={leftButtonRef}
            onClick={() => {
              if (firstItemInView) {
                scrollToIndex(firstItemInView.index - 1);
              }
            }}
            className={
              "bg-paper_2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-color "
            }
          >
            <svg
              fill={"transparent"}
              stroke={
                elements[0]?.isIntersecting
                  ? "rgb(255 255 255 / 0.25)"
                  : "rgb(255 255 255)"
              }
              className="-rotate-90 w-[32px] h-[32px]"
            >
              <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
            </svg>
          </button>
          <button
            ref={rightButtonRef}
            onClick={() => {
              if (lastItemInView) {
                scrollToIndex(lastItemInView.index + 1);
              }
            }}
            className="bg-paper_2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-color"
          >
            <svg
              fill={"transparent"}
              stroke={
                elements.at(-1)?.isIntersecting
                  ? "rgb(255 255 255 / 0.25)"
                  : "rgb(255 255 255)"
              }
              className="rotate-90 w-[32px] h-[32px]"
            >
              <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={listRef}
          id={collection.collection_key + "-mobile-scroll-list"}
          className="flex gap-4 overflow-scroll scrollbar-hidden
          snap-x snap-mandatory grid-cols-10"
        >
          <div
            style={{ inlineSize: "208px" }}
            className="shrink-0 xs-right-pad:hidden"
          />
          {collection.list_game.map((game) => (
            <PortraitGameCard
              key={game.ID}
              game={game}
              className="snap-start last-of-type:snap-end flex-shrink-0
              w-[calc(calc(100vw_-_72px)_-_1px)]
              xs:w-[calc(calc(100vw_-_32px)/2_-_13px)]
              3/4sm:w-[calc(calc(100vw_-_32px)/3_-_13px)]
              sm:w-[calc(calc(100vw_-_32px)/4_-_13px)]
              md:w-[calc(calc(100vw_-_32px)/4_-_13px)]
              lg:w-[calc(calc(100vw_-_192px)/5_-_13px)]
              xl:w-[calc(calc(100vw_-_352px)/5_-_13px)]
              2xl:w-[calc(calc(100vw_-_352px)/7_-_13px)]
              4xl:w-[calc(calc(100vw_-_352px)/9_-_13px)]"
            />
          ))}
          <div
            style={{ inlineSize: "208px" }}
            className="shrink-0 xs-right-pad:hidden"
          />
        </div>
      </div>
    </>
  );
};

export default Carousel;
