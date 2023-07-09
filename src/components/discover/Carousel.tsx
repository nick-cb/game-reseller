"use client";

import React, { useRef } from "react";
import PortraitGameCard from "../PortraitGameCard";
import Link from "next/link";

const Carousel = ({
  collection,
  className,
}: {
  collection: any;
  className?: string;
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <section key={collection._id} className={className}>
      <div className={"flex justify-between mb-4"}>
        <Link
          className="text-white text-lg flex items-center group gap-2 w-max pr-4"
          href={`/browse?category=${collection._id}`}
        >
          {collection.name[0].toUpperCase() + collection.name.substring(1)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="14px"
            height="14px"
            className="group-hover:translate-x-2 transition-transform mt-[2px]"
          >
            <g id="Icon">
              <path
                fill="white"
                d="M5.53,14.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
                className="transition-colors"
              />
            </g>
          </svg>
        </Link>
        <div className={"flex items-center gap-2"}>
          <button
            // onClick={() => {
            //   listRef.current?.scroll({
            //     left: (listRef.current.scrollLeft || 0) - 288,
            //     behavior: "smooth",
            //   });
            // }}
            ref={leftButtonRef}
            onClick={() => {
              if ((listRef.current?.scrollLeft || 0) <= 0) {
                return;
              }
              listRef.current?.scroll({
                left: (listRef.current.scrollLeft || 0) - 288,
                behavior: "smooth",
              });
            }}
            className="bg-paper_2 w-8 h-8 flex items-center justify-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="14px"
              height="14px"
              className={
                "group-hover:translate-x-2 transition-transform mt-[2px] rotate-180"
              }
            >
              <g id="Icon">
                <path
                  fill="white"
                  d="M5.53,14.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
                  className="!fill-white/25 transition-colors"
                />
              </g>
            </svg>
          </button>
          <button
            // onClick={() => {
            //   listRef.current?.scroll({
            //     left: (listRef.current.scrollLeft || 0) + 288,
            //     behavior: "smooth",
            //   });
            // }}
            ref={rightButtonRef}
            onClick={() => {
              const { current } = listRef;
              if (!current) {
                return;
              }
              if (
                (current.scrollLeft || 0) >=
                current.scrollWidth - current.clientWidth
              ) {
                return;
              }
              listRef.current?.scroll({
                left: (listRef.current.scrollLeft || 0) + 288,
                behavior: "smooth",
              });
            }}
            className="bg-paper_2 w-8 h-8 flex items-center justify-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="14px"
              height="14px"
              className={
                "group-hover:translate-x-2 transition-transform mt-[2px]"
              }
            >
              <g id="Icon">
                <path
                  fill="white"
                  d="M5.53,14.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div className="relative">
        {/* <div */}
        {/*   ref={listRef} */}
        {/*   className="flex gap-4 overflow-x-auto snap-x snap-mandatory */}
        {/*   xs-right-pad:contents [scrollbar-width:none] [-ms-overflw-style:none] */}
        {/*   xs-right-pad:[scrollbar-width:auto] xs-right-pad:[-ms-overflw-style:auto]" */}
        {/*   onScroll={() => { */}
        {/*     const { current } = listRef; */}
        {/*     if (!current) { */}
        {/*       return; */}
        {/*     } */}
        {/*     if ((current.scrollLeft || 0) <= 224) { */}
        {/*       leftButtonRef.current?.style.setProperty("opacity", "0"); */}
        {/*     } else { */}
        {/*       leftButtonRef.current?.style.setProperty("opacity", "1"); */}
        {/*     } */}
        {/*     if ( */}
        {/*       (current.scrollLeft || 0) + 224 >= */}
        {/*       current.scrollWidth - current.clientWidth */}
        {/*     ) { */}
        {/*       rightButtonRef.current?.style.setProperty("opacity", "0"); */}
        {/*     } else { */}
        {/*       rightButtonRef.current?.style.setProperty("opacity", "1"); */}
        {/*     } */}
        {/*   }} */}
        {/* > */}
        <div
          ref={listRef}
          className="flex gap-4 overflow-scroll
          snap-x snap-mandatory grid-cols-10"
          onScroll={() => {
            const { current } = listRef;
            if (!current) {
              return;
            }
            if ((current.scrollLeft || 0) <= 224) {
              const path = leftButtonRef.current?.querySelector("path");
              if (path) {
                path.classList.add("!fill-white/25");
              }
            } else {
              const path = leftButtonRef.current?.querySelector("path");
              if (path) {
                path.classList.remove("!fill-white/25");
              }
            }
            if (
              (current.scrollLeft || 0) + 224 >=
              current.scrollWidth - current.clientWidth
            ) {
              const path = rightButtonRef.current?.querySelector("path");
              if (path) {
                path.classList.add("!fill-white/25");
              }
            } else {
              const path = rightButtonRef.current?.querySelector("path");
              if (path) {
                path.classList.remove("!fill-white/25");
              }
            }
          }}
        >
          <div
            style={{ inlineSize: "208px" }}
            className="shrink-0 xs-right-pad:hidden"
          />
          {collection.list_game.map((game: any) => (
            <PortraitGameCard
              key={game._id}
              game={game}
              className="snap-start flex-shrink-0
              w-[calc(calc(100vw_-_32px)_-_13px)]
              xs:w-[calc(calc(100vw_-_32px)/2_-_13px)]
              3/4xs:w-[calc(calc(100vw_-_32px)/3_-_13px)]
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
    </section>
  );
};

export default Carousel;
