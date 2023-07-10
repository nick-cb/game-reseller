"use client";

import { MouseEvent, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Cover } from "./hero_carousel/HeroCarousel";

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

  const _data = useMemo(() => {
    return data?.list_game.slice(0, 6).map((game: any) => ({
      ...game,
      image: {
        landscape: game.images.find((img: any) => img.type === "landscape"),
        portrait: game.images.find((img: any) => img.type === "portrait"),
        logo: game.images.find((img: any) => img.type === "logo"),
      },
    }));
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
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
            indicatorListRef.current?.children
              .item(prevIndex.current)
              ?.children.item(0)
              ?.classList.remove("bg-white/60");
            listRef.current?.scroll({
              left:
                index * (listRef.current.children.item(0)?.clientWidth || 0),
              behavior: "smooth",
            });
            prevIndex.current = index;
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
  }, []);

  const goToIndex = (event: MouseEvent<HTMLButtonElement>, index: number) => {
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

  return (
    <div>
      <ul
        ref={listRef}
        className={
          "w-full flex gap-4 overflow-scroll snap-x snap-mandatory " + className
        }
      >
        {_data.map((item: any, index: number) => (
          <li
            data-index={index}
            key={item._id}
            className={
              "relative w-11/12 aspect-video flex-shrink-0 h-full snap-start rounded-lg overflow-hidden"
            }
          >
            <Image className="" src={item.image.landscape.url} alt="" fill />
            <Cover game={item} />
          </li>
        ))}
      </ul>
      <ul
        ref={indicatorListRef}
        className="flex w-full justify-center items-center gap-4 pt-4 md:hidden"
      >
        <li>
          <button
            data-index="0"
            onClick={(event) => goToIndex(event, 0)}
            className="bg-paper_2 w-2 h-2 rounded-md bg-white/60 transition-colors"
          ></button>
        </li>
        <li>
          <button
            data-index="1"
            onClick={(event) => goToIndex(event, 1)}
            className="bg-paper_2 w-2 h-2 rounded-md transition-colors"
          ></button>
        </li>
        <li>
          <button
            data-index="2"
            onClick={(event) => goToIndex(event, 2)}
            className="bg-paper_2 w-2 h-2 rounded-md transition-colors"
          ></button>
        </li>
        <li>
          <button
            data-index="3"
            onClick={(event) => goToIndex(event, 3)}
            className="bg-paper_2 w-2 h-2 rounded-md transition-colors"
          ></button>
        </li>
        <li>
          <button
            data-index="4"
            onClick={(event) => goToIndex(event, 4)}
            className="bg-paper_2 w-2 h-2 rounded-md transition-colors"
          ></button>
        </li>
        <li>
          <button
            data-index="5"
            onClick={(event) => goToIndex(event, 5)}
            className="bg-paper_2 w-2 h-2 rounded-md transition-colors"
          ></button>
        </li>
      </ul>
    </div>
  );
}
