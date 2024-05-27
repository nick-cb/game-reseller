"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ChevronButton from "../../ChevronButton";
import { useBreakpoints } from "@/hooks/useBreakpoint";

const breakPoints = [640] as const;
const Carousel3D = ({ data }: { data: any[] }) => {
  const prevIndex = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = listRef.current;
    if (!current) {
      return;
    }
    const children = current?.children;
    if (!children) {
      return;
    }
    const childrenArr = Array.from(children);
    const tz = Math.round(
      current.clientWidth / 2 / Math.tan(Math.PI / childrenArr.length)
    );
    const rotateBy = 360 / childrenArr.length;
    listRef.current.parentElement?.classList.add("carousel-scene");
    listRef.current.classList.add("carousel-3d");
    current?.style.setProperty("transform", `translateZ(-${tz}px)`);
    current?.style.setProperty("height", `translateZ(-${tz}px)`);
    let maxHeight = 0;
    for (let index = 0; index < childrenArr.length; index++) {
      const c = childrenArr[index];
      maxHeight = Math.max(maxHeight, c.clientHeight);
      (c as HTMLElement).style.setProperty(
        "transform",
        `rotateY(${index * rotateBy}deg) translateZ(${tz}px)`
      );
      (c as HTMLElement).style.setProperty("position", "absolute");
    }

    current?.style.setProperty("height", `${maxHeight}px`);
  }, []);

  useEffect(() => {
    const current = listRef.current;
    if (!current) {
      return;
    }
    const children = current?.children;
    if (!children) {
      return;
    }
    const childrenArr = Array.from(children);
    const tz = Math.round(
      current.clientWidth / 2 / Math.tan(Math.PI / childrenArr.length)
    );
    const rotateBy = 360 / childrenArr.length;

    current?.style.setProperty(
      "transform",
      `translateZ(-${tz}px) rotateY(${-currentIndex * rotateBy}deg)`
    );
    previewListRef.current
      ?.querySelector(`li:nth-child(${(currentIndex % data.length) + 2})`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    let id: ReturnType<typeof setTimeout>;
    const animationId = requestAnimationFrame(() => {
      id = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 5000);
    });

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(id);
    };
  }, [currentIndex]);

  const { b640 } = useBreakpoints(breakPoints);

  useEffect(() => {
    if (b640 >= 0) {
      const outline = outlineRef.current;
      const fromIndex = prevIndex.current % data.length;
      const toIndex = currentIndex % data.length;
      const fromElement = previewListRef.current?.querySelector<HTMLLIElement>(
        `li:nth-child(${fromIndex + 2})`
      );
      const toElement = previewListRef.current?.querySelector<HTMLLIElement>(
        `li:nth-child(${toIndex + 2})`
      );
      if (!outline) {
        return;
      }
      if (toIndex > fromIndex) {
        outline.style.setProperty("left", fromElement?.offsetLeft + "px");
        outline.style.setProperty("right", "unset");
      } else {
        outline.style.setProperty(
          "right",
          (previewListRef.current?.offsetWidth || 0) -
            (fromElement?.offsetLeft || 0) -
            96 +
            "px"
        );
        outline.style.setProperty("left", "unset");
      }
      outline.style.setProperty("z-index", (10).toString());
      outline.style.setProperty(
        "width",
        (
          96 * (Math.abs(toIndex - fromIndex) + 1) +
          Math.abs(toIndex - fromIndex) * 16
        ).toString() + "px"
      );
      setTimeout(() => {
        if (toIndex > fromIndex) {
          outline.style.setProperty(
            "right",
            (previewListRef.current?.offsetWidth || 0) -
              (toElement?.offsetLeft || 0) -
              96 +
              "px"
          );
          outline.style.setProperty("left", "unset");
        } else {
          outline.style.setProperty("left", toElement?.offsetLeft + "px");
          outline.style.setProperty("right", "unset");
        }
        outline.style.setProperty("width", "96px");
        prevIndex.current = toIndex;
      }, 250);
    }
  }, [b640, currentIndex]);

  return (
    <>
      <div className="flex overflow-hidden">
        <ul ref={listRef} className="flex w-full">
          {data.map((image: any, index: number) => (
            <li className="w-full shrink-0 carousel-item" key={index}>
              <div className="relative w-full aspect-video">
                <Image
                  src={image.url}
                  alt={image.type}
                  className="rounded"
                  fill
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        <ul
          className="mt-4 py-[1px] px-[1px] relative
          overflow-auto snap-x snap-mandatory scrollbar-hidden
          col-start-1 col-end-3 scroll-p-2 [scrollbar-width:none] [-ms-overflw-style:none]
          gap-4 flex justify-center sm:justify-start"
          ref={previewListRef}
          onScroll={() => {
            const { current } = previewListRef;
            if (!current) {
              return;
            }
            if ((current.scrollLeft || 0) <= 0) {
              leftButtonRef.current?.style.setProperty("opacity", "0");
            } else {
              leftButtonRef.current?.style.setProperty("opacity", "1");
            }
            if (
              (current.scrollLeft || 0) >=
              current.scrollWidth - current.clientWidth
            ) {
              rightButtonRef.current?.style.setProperty("opacity", "0");
            } else {
              rightButtonRef.current?.style.setProperty("opacity", "1");
            }
          }}
        >
          <div
            ref={outlineRef}
            className={"gameid-preview-outline " + (b640 < 0 ? "hidden" : "")}
          />
          {data.map((image: any, index: number) => {
            return (
              <li
                key={index}
                onClick={(e) => {
                  setCurrentIndex(index);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
              >
                <div
                  className={`relative 
                  w-4 h-1 rounded bg-paper sm:h-auto sm:w-24 sm:aspect-video snap-start
                  md:after:content-[none] after:absolute after:top-0 after:bottom-0 after:bg-white/25 after:rounded
                  ${
                    currentIndex % data.length === index
                      ? "sm:outline-1 after:animate-[animate-full-width_5s_linear]"
                      : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.type}
                    className="rounded hidden sm:block"
                    fill
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <ChevronButton
          direction="left"
          className="top-1/2 -translate-y-1/2 hidden sm:block"
          ref={leftButtonRef}
          onClick={() => {
            if ((previewListRef.current?.scrollLeft || 0) <= 0) {
              return;
            }
            previewListRef.current?.scroll({
              left: (previewListRef.current.scrollLeft || 0) - 100,
              behavior: "smooth",
            });
          }}
        />
        <ChevronButton
          direction="right"
          className="top-1/2 -translate-y-1/2 hidden sm:block opacity-100"
          ref={rightButtonRef}
          onClick={() => {
            const { current } = previewListRef;
            if (!current) {
              return;
            }
            if (
              (current.scrollLeft || 0) >=
              current.scrollWidth - current.clientWidth
            ) {
              return;
            }
            previewListRef.current?.scroll({
              left: (previewListRef.current.scrollLeft || 0) + 100,
              behavior: "smooth",
            });
          }}
        />
      </div>
    </>
  );
};

export default Carousel3D;
