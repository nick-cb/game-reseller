"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Video from "../Video";
import Image from "next/image";
import ChevronButton from "../ChevronButton";
import { useBreakpoints } from "@/hooks/useBreakpoint";

const SLIDE_INTERVAL = 5000;
export default function LinearCarousel({
  images = [],
  videos = [],
}: {
  images: any[];
  videos: any[];
}) {
  const prevIndex = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => videos.concat(images), [images, videos]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { b640: sm } = useBreakpoints([640]);

  useEffect(() => {
    if (data.length <= 1) {
      return;
    }
    const previewList = previewListRef.current;
    if (!previewList) {
      return;
    }
    if (previewList.scrollWidth <= previewList.offsetWidth) {
      rightButtonRef.current?.style.setProperty("opacity", "0");
    }
  }, [data]);

  useEffect(() => {
    if (data.length <= 1) {
      return;
    }
    const list = listRef.current;
    if (!list) {
      return;
    }
    const { width } = list.getBoundingClientRect();
    console.log({ width, currentIndex });
    list.style.setProperty(
      "transform",
      `translateX(-${width * currentIndex}px)`
    );

    // Don't schedule next transform if the current item is video
    // It will be handle by the onEnded event on video element
    if ('recipes' in data[currentIndex]) {
      return;
    }
    let id: ReturnType<typeof setTimeout>;
    const animationId = requestAnimationFrame(() => {
      if (currentIndex === data.length) {
        id = setTimeout(() => {
          setCurrentIndex(0);
        }, SLIDE_INTERVAL);
      } else {
        id = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % data.length);
        }, SLIDE_INTERVAL);
      }
    });

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(id);
    };
  }, [currentIndex, data]);

  useEffect(() => {
    if (data.length <= 1) {
      return;
    }
    if (sm >= 0) {
      const outline = outlineRef.current;
      const fromIndex = prevIndex.current % data.length;
      const toIndex = currentIndex % data.length;
      const previewList = previewListRef.current;
      if (!previewList || !outline) {
        return;
      }
      const fromElement = previewListRef.current.querySelector<HTMLLIElement>(
        `li:nth-of-type(${fromIndex + 1})`
      );
      const toElement = previewListRef.current.querySelector<HTMLLIElement>(
        `li:nth-of-type(${toIndex + 1})`
      );
      if (!fromElement || !toElement) {
        return;
      }
      if (toIndex > fromIndex) {
        outline.style.setProperty("left", fromElement.offsetLeft + "px");
        outline.style.setProperty("right", "unset");
      } else {
        outline.style.setProperty(
          "right",
          previewList.offsetWidth - fromElement.offsetLeft - 96 + "px"
        );
        outline.style.setProperty("left", "unset");
      }
      outline.style.setProperty("z-index", (1).toString());
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
            previewList.offsetWidth - toElement.offsetLeft - 96 + "px"
          );
          outline.style.setProperty("left", "unset");
        } else {
          outline.style.setProperty("left", toElement.offsetLeft + "px");
          outline.style.setProperty("right", "unset");
        }
        outline.style.setProperty("width", "96px");
        prevIndex.current = toIndex;
      }, 250);
    }
  }, [currentIndex]);

  return (
    <>
      <div className="relative overflow-hidden group">
        {/* <div className="absolute inset-0 controls">
          <button
            className="absolute w-14 h-full left-0 transition-transform
          from-paper_3/40 bg-gradient-to-r to-default/0 z-10
          -translate-x-full group-hover:translate-x-0"
          >
            left
          </button>
          <button
            className="absolute w-14 h-full right-0 transition-transform
          from-paper_3/40 bg-gradient-to-l to-default/0 z-10
          translate-x-full group-hover:translate-x-0"
          >
            right
          </button>
        </div> */}
        <div className="overflow-scroll scrollbar-hidden game-linear-carousel snap-mandatory snap-x">
          <ul className="flex transition-transform duration-300" ref={listRef}>
            {videos.map((vid, index) => (
              <li
                key={index}
                className="rounded overflow-hidden w-full shrink-0 mr-4 snap-start"
              >
                <Video
                  video={vid}
                  // onEnded={() => {
                  //   setTimeout(() => {
                  //     setCurrentIndex((prev) => {
                  //       return (prev + 1) % data.length;
                  //     });
                  //   }, SLIDE_INTERVAL);
                  // }}
                />
              </li>
            ))}
            {images.map((img, index) => (
              <li
                key={index}
                className="rounded overflow-hidden w-full shrink-0 snap-start"
              >
                <div className="relative w-full aspect-video">
                  <Image src={img.url} alt={img.type} fill />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {data.length > 1 ? (
        <div className="relative flex justify-center mt-4">
          <ul
            className="py-[1px] px-[1px] relative
          overflow-auto snap-x snap-mandatory scrollbar-hidden
          col-start-1 col-end-3 scroll-p-2 [scrollbar-width:none] [-ms-overflw-style:none]
          gap-4 flex w-max max-w-full"
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
              className={"gameid-preview-outline hidden sm:block"}
            />
            {videos.map((vid, index) => (
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
                    src={vid.thumbnail}
                    alt={""}
                    className="rounded hidden sm:block"
                    fill
                  />
                </div>
              </li>
            ))}
            {images.map((img, index) => (
              <li
                key={index + videos.length}
                onClick={(e) => {
                  setCurrentIndex(index + videos.length);
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
                    currentIndex % data.length === index + videos.length
                      ? "sm:outline-1 after:animate-[animate-full-width_5s_linear]"
                      : ""
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.type}
                    className="rounded hidden sm:block"
                    fill
                  />
                </div>
              </li>
            ))}
          </ul>
          <ChevronButton
            direction="left"
            className="top-1/2 -translate-y-1/2 hidden sm:block"
            ref={leftButtonRef}
            onClick={() => {
              const previewList = previewListRef.current;
              if (!previewList) {
                return;
              }
              if (previewList.scrollLeft <= 0) {
                return;
              }
              // userInteract.current = true;
              previewList.scroll({
                left: previewList.scrollLeft - 100,
                behavior: "smooth",
              });
            }}
          />
          <ChevronButton
            direction="right"
            className="top-1/2 -translate-y-1/2 hidden sm:block opacity-100"
            ref={rightButtonRef}
            onClick={() => {
              const previewList = previewListRef.current;
              if (!previewList) {
                return;
              }

              if (
                previewList.scrollLeft >=
                previewList.scrollWidth - previewList.clientWidth
              ) {
                return;
              }
              // userInteract.current = true;
              previewListRef.current?.scroll({
                left: previewList.scrollLeft + 100,
                behavior: "smooth",
              });
            }}
          />
        </div>
      ) : null}
    </>
  );
}
