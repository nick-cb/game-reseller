"use client";

import React, { useRef } from "react";
import PortraitGameCard from "../PortraitGameCard";
import ChevronButton from "../ChevronButton";

const Carousel = ({ data }: { data: any[] }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <div
        ref={listRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory
      xs-right-pad:contents [scrollbar-width:none] [-ms-overflw-style:none]
      xs-right-pad:[scrollbar-width:auto] xs-right-pad:[-ms-overflw-style:auto]"
        onScroll={() => {
          const { current } = listRef;
          if (!current) {
            return;
          }
          if ((current.scrollLeft || 0) <= 224) {
            leftButtonRef.current?.style.setProperty("opacity", "0");
          } else {
            leftButtonRef.current?.style.setProperty("opacity", "1");
          }
          if (
            (current.scrollLeft || 0) + 224 >=
            current.scrollWidth - current.clientWidth
          ) {
            rightButtonRef.current?.style.setProperty("opacity", "0");
          } else {
            rightButtonRef.current?.style.setProperty("opacity", "1");
          }
        }}
      >
        <div
          style={{ inlineSize: "208px" }}
          className="shrink-0 xs-right-pad:hidden"
        />
        <div
          className="contents xs-right-pad:grid gap-4
              grid-cols-1 xs:grid-cols-2 3/4sm:grid-cols-3 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 2xl:grid-cols-7 4xl:grid-cols-9"
        >
          {data.map((game: any) => (
            <PortraitGameCard
              key={game._id}
              game={game}
              className="snap-center w-full flex-shrink-0 xs-right-pad:flex-shrink xs-right-pad:w-auto xs-right-pad:hidden first:block xs:[&:nth-child(-n+2)]:block
                  3/4sm:[&:nth-child(-n+3)]:block md:[&:nth-child(-n+4)]:block
                  lg:[&:nth-child(-n+5)]:block 2xl:[&:nth-child(-n+7)]:block 4xl:[&:nth-child(-n+9)]:block
                  "
            />
          ))}
        </div>
        <div
          style={{ inlineSize: "208px" }}
          className="shrink-0 xs-right-pad::hidden"
        />
        <ChevronButton
          direction="left"
          className="block
        top-[calc(calc(100%-84px)/2)] -translate-y-1/2 xs-right-pad:hidden"
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
        />
        <ChevronButton
          direction="right"
          className="block
        top-[calc(calc(100%-84px)/2)] -translate-y-1/2 xs-right-pad:hidden opacity-100"
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
        />
      </div>
    </div>
  );
};

export default Carousel;
