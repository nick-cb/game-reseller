"use client";
import {useBreakpoints} from "@/hooks/useBreakpoint";
import "./hero-carousel.css";
import Image from "next/image";
import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import {HeroCarouselGame} from "@/components/home/hero_carousel/Description";

const breakpoints = [640] as const;

type HeroCarouselProps = {
  data: HeroCarouselGame[];
  className?: string;
};
const HeroCarousel = ({
  children,
  data,
  className = "",
}: PropsWithChildren<HeroCarouselProps>) => {
  const { b640: sm } = useBreakpoints(breakpoints);
  const [index, setIndex] = useState(-1);
  let prev = useRef(0);
  const mainListRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (sm < 0) {
      return;
    }
    const mainList = mainListRef.current;
    const previewList = previewListRef.current;
    if (!mainList || !previewList) {
      return;
    }
    mainList.offsetParent?.classList.remove("overflow-scroll");
    mainList.offsetParent?.classList.add("overflow-hidden");
    mainList.classList.add("stack-fade-carousel");
    for (const item of previewList.children) {
      item.classList.add("pointer-none");
    }
  }, []);

  useEffect(() => {
    if (sm < 0) {
      return;
    }
    const mainList = mainListRef.current;
    const previewList = previewListRef.current;
    if (!mainList || !previewList) {
      return;
    }
    if (index !== -1) {
      mainList?.children.item(prev.current)?.classList.add("not-active");
      mainList?.children.item(prev.current)?.classList.remove("active");
      mainList?.children.item(index)?.classList.add("active");
      mainList?.children.item(index)?.classList.remove("not-active");
    }

    previewList.children.item(prev.current)?.classList.remove("active");
    previewList.children
      .item(index === -1 ? 0 : index)
      ?.classList.add("active");
    prev.current = index === -1 ? 0 : index;

    const id = setTimeout(() => {
      requestAnimationFrame(() => {
        setIndex((prev) => (index === -1 ? 1 : (prev + 1) % data.length));
      });
    }, 10000);
    return () => {
      clearTimeout(id);
    };
  }, [index]);

  const onClick = (index: number) => {
    setIndex(index);
  };

  return (
    <div
      className={
        "sm:flex gap-4 lg:gap-8 " + className + (sm < 0 ? "hidden" : "")
      }
    >
      <div className="w-full sm:w-[75%] lg:w-4/5 aspect-[1.6] lg:aspect-video overflow-scroll rounded-lg relative scrollbar-hidden snap-x snap-mandatory">
        <ul className="main-list h-full" ref={mainListRef}>
          {children}
        </ul>
      </div>
      <ul ref={previewListRef} className="sm:flex flex-col gap-2 flex-1 hidden">
        {data.map((item, itemIndex) => (
          <li
            key={item.ID}
            className="hero-carousel-preview-item w-full h-full relative rounded-xl overflow-hidden
            after:absolute after:inset-0 hover:bg-paper_2 after:bg-paper"
            onClick={() => {
              if (itemIndex === prev.current) {
                return;
              }
              onClick(itemIndex);
            }}
            title={item.name}
          >
            <a
              className="flex items-center gap-4 h-full w-full focus:bg-paper_2 p-2 lg:p-3"
              href="#"
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
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeroCarousel;
