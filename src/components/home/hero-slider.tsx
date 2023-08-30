"use client";

import { MouseEvent, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useInfiniteScrollText } from "../InfiniteScrollText";
import Link from "next/link";
import { useBreakpoints } from "@/hooks/useBreakpoint";

const breakpoints = [768] as const;
export function HeroSlider({
  data,
  className = "",
}: {
  data: any;
  className?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorListRef = useRef<HTMLUListElement>(null);
  const prevIndex = useRef(0);
  const { b768: md } = useBreakpoints(breakpoints);

  const _data = useMemo(() => {
    return data?.list_game.slice(0, 6);
  }, [data]);

  useEffect(() => {
    if (md >= 0) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio > 0.5) {
            const target = entry.target as HTMLButtonElement;
            const dataIndex = target.dataset.index;
            if (!dataIndex) {
              continue;
            }
            const index = parseInt(dataIndex);
            indicatorListRef.current?.children
              .item(index)
              ?.children.item(0)
              ?.classList.add("bg-white/60");
          } else {
            const target = entry.target as HTMLButtonElement;
            const dataIndex = target.dataset.index;
            if (!dataIndex) {
              continue;
            }
            const index = parseInt(dataIndex);
            indicatorListRef.current?.children
              .item(index)
              ?.children.item(0)
              ?.classList.remove("bg-white/60");
          }
        }
      },
      {
        root: listRef.current,
      }
    );
    if (listRef.current) {
      for (const item of listRef.current.children) {
        const button = item.children.item(0);
        if (button) {
          observer.observe(button);
        }
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [md]);

  const goToIndex = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    if (index === prevIndex.current) {
      return;
    }
    event.currentTarget.classList.add("bg-white/60");
    indicatorListRef.current?.children
      .item(prevIndex.current)
      ?.children.item(0)
      ?.classList.remove("bg-white/60");
    listRef.current?.scroll({
      left: index * (listRef.current.children.item(0)?.clientWidth || 0),
      behavior: "smooth",
    });
    prevIndex.current = index;
  };

  if (md >= 0) {
    return null;
  }

  return (
    <div>
      <ul
        ref={listRef}
        className={
          "w-full flex gap-4 overflow-scroll scrollbar-hidden snap-x snap-mandatory " +
          className
        }
      >
        {_data.map((item: any, index: number) => (
          <SliderItem key={index} item={item} index={index} />
        ))}
      </ul>
      <ul
        ref={indicatorListRef}
        className="flex w-full justify-center items-center gap-4 pt-4 md:hidden"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <li key={index} className="group">
            <button
              data-index={index}
              onClick={(event) => goToIndex(event, index)}
              className="bg-paper_2 w-2 h-2 rounded-md transition-colors"
            ></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SliderItem({ item, index }: { item: any; index: number }) {
  const scrollNameContainerRef = useRef<HTMLDivElement>(null);
  useInfiniteScrollText({
    containerRef: scrollNameContainerRef,
    scrollRef: scrollNameContainerRef,
  });

  return (
    <li
      className={
        "relative w-11/12 aspect-[9/11] flex-shrink-0 h-full snap-start rounded-xl overflow-hidden flex "
      }
    >
      <div
        data-index={index}
        className="intersect-point absolute left-1/2 top-1/2 bg-blue-200"
      ></div>
      <Link href={"/" + item.slug} className="contents">
        <Image className="" src={item.images.portrait.url} alt="" fill />
      </Link>
      <div
        className={
          "bg-gradient-to-t from-paper_3 via-40% via-paper_3/80 to-transparent " +
          " h-1/2  absolute w-full bottom-0 flex items-end " +
          " pointer-events-none "
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
            src={item.images.logo.url}
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
          <div className="flex gap-10" ref={scrollNameContainerRef}>
            <p className={"text-sm text-white_primary whitespace-nowrap w-max"}>
              {item.name}
            </p>
          </div>
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
              {item.rating.averageRating}
            </p>
          </div>
          <button className="text-sm px-4 py-2 bg-white rounded text-default">
            Buy now
          </button>
        </div>
      </div>
    </li>
  );
}
