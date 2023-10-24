"use client";

import { useEffect, useMemo, useRef } from "react";
import Video from "../Video";
import Image from "next/image";
import ChevronButton from "../ChevronButton";
import { useBreakpoints } from "@/hooks/useBreakpoint";
import { FVideoFullInfo, OmitGameId } from "@/actions/game/select";
import { GameImages } from "@/database/models";
import {ScrollItem} from "@/components/scroll/index";
import {useScroll, useScrollFactory} from "@/components/scroll/hook";

const SLIDE_INTERVAL = 5000;
export default function LinearCarousel({
  images = [],
  videos = [],
}: {
  images: OmitGameId<GameImages>[];
  videos: OmitGameId<FVideoFullInfo>[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);
  const data = useMemo(() => {
    const _data: (OmitGameId<FVideoFullInfo> | OmitGameId<GameImages>)[] = [];
    return _data.concat(videos).concat(images);
  }, [images, videos]);

  const { b640: sm } = useBreakpoints([640]);
  const factory = useScrollFactory({
    containerSelector: "#linear-carousel-indicator",
    observerOptions: {
      threshold: 0.9,
    },
  });
  const { elements, scrollToIndex } = useScroll();
  const indicatorScroll = useScroll(factory);
  const active = useMemo(() => {
    const index = elements.findIndex((el) => el.intersectionRatio >= 0.5);
    if (index < 0) {
      return {
        index: 0,
        element: undefined,
      };
    }
    return {
      index,
      element: elements[index],
    };
  }, [elements]);

  const goToItem = (index: number) => {
    if (index === active.index) {
      return;
    }
    scrollToIndex(index);
    indicatorScroll.scrollToIndex(index);
  };

  useEffect(() => {
    if ("recipes" in (data[active.index] || {}) && sm >= 0) {
      return;
    }
    let timeOut: ReturnType<typeof setTimeout>;
    const animationFrame = requestAnimationFrame(() => {
      timeOut = setTimeout(() => {
        const nextIndex = (active.index + 1) % data.length;
        if (nextIndex === data.length) {
          goToItem(0);
        } else {
          goToItem(nextIndex);
        }
      }, SLIDE_INTERVAL);
    });
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeOut);
    };
  }, [active.index, data, sm]);

  return (
    <>
      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 controls">
          <div
            className={
              "w-12 h-full absolute flex justify-center items-center z-[1] " +
              " left-0  bg-gradient-to-r " +
              " from-paper_3/40 to-default/0 " +
              " transition-transform -translate-x-full group-hover:translate-x-0 "
            }
          >
            <button
              onClick={() => {
                goToItem(active.index - 1);
              }}
              className=" w-8 h-10 flex justify-center items-center focus:outline outline-1 rounded "
            >
              <svg width={24} height={24} fill="white" className="rotate-90">
                <use
                  width={24}
                  height={24}
                  xlinkHref="/svg/sprites/actions.svg#chevron-thin-down"
                />
              </svg>
            </button>
          </div>
          <div
            className={
              "w-12 h-full absolute flex justify-center items-center z-[1] " +
              " right-0  bg-gradient-to-l " +
              " from-paper_3/40 to-default/0 " +
              " transition-transform translate-x-full group-hover:translate-x-0 "
            }
          >
            <button
              onClick={() => {
                goToItem(active.index + 1);
              }}
              className=" w-8 h-10 flex justify-center items-center focus:outline outline-1 rounded "
            >
              <svg width={24} height={24} fill="white" className="-rotate-90">
                <use
                  width={24}
                  height={24}
                  xlinkHref="/svg/sprites/actions.svg#chevron-thin-down"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul
          id={"linear-carousel"}
          ref={listRef}
          className="flex overflow-scroll snap-mandatory snap-x scrollbar-hidden"
        >
          {sm >= 0
            ? videos.map((vid, index) => (
                <ScrollItem
                  key={index}
                  as={"li"}
                  className="rounded overflow-hidden w-full shrink-0 mr-4 snap-start"
                >
                  {sm >= 0 ? (
                    <Video
                      // @ts-ignore
                      video={vid}
                      onEnded={() => {
                        setTimeout(() => {
                          if (index === data.length - 1) {
                            goToItem(0);
                            return;
                          }
                          goToItem(active.index + 1);
                        }, SLIDE_INTERVAL);
                      }}
                      className="w-full"
                    />
                  ) : null}
                </ScrollItem>
              ))
            : null}
          {images.map((img, index) => (
            <ScrollItem
              key={index}
              as={"li"}
              className="rounded overflow-hidden w-full shrink-0 snap-start"
            >
              <div className="relative w-full aspect-video">
                <Image src={img.url} alt={img.type} fill />
              </div>
            </ScrollItem>
          ))}
        </ul>
      </div>
      {data.length > 1 ? (
        <div className="relative flex justify-center mt-4">
          <ul
            id={"linear-carousel-indicator"}
            ref={previewListRef}
            className="py-[1px] px-[1px] relative
          overflow-auto snap-x snap-mandatory scrollbar-hidden
          col-start-1 col-end-3 scroll-p-2 [scrollbar-width:none] [-ms-overflw-style:none]
          gap-4 flex w-max max-w-full"
          >
            {sm >= 0
              ? videos.map((vid, index) => {
                  return (
                    <ScrollItem
                      key={index}
                      as="li"
                      factory={factory}
                      onClick={() => {
                        goToItem(index);
                      }}
                    >
                      <div
                        className={
                          "relative transition-opacity w-24 h-14 rounded bg-default snap-start " +
                          (active.index === index
                            ? " opacity-100 outline outline-1 "
                            : "")
                        }
                      >
                        <Image
                          src={vid.thumbnail}
                          alt={""}
                          className="rounded sm:block"
                          fill
                        />
                      </div>
                    </ScrollItem>
                  );
                })
              : null}
            {sm >= 0
              ? images.map((img, index) => {
                  return (
                    <ScrollItem
                      key={index + videos.length}
                      as="li"
                      factory={factory}
                      onClick={() => {
                        goToItem(index + videos.length);
                      }}
                    >
                      <div
                        className={
                          "relative transition-opacity w-24 h-14 rounded bg-default snap-start " +
                          (active.index === index + videos.length
                            ? " opacity-100 outline outline-1 "
                            : "")
                        }
                      >
                        <Image
                          src={img.url}
                          alt={img.type}
                          className="rounded hidden sm:block"
                          fill
                        />
                      </div>
                    </ScrollItem>
                  );
                })
              : null}
            {sm < 0
              ? data.map((item, index) => {
                  if ("recipes" in item) {
                    return null;
                  }
                  return (
                    <li
                      key={item.ID}
                      className={
                        "relative w-4 h-1 rounded bg-paper " +
                        " after:absolute after:inset-0 after:rounded " +
                        " after:transition-[width] after:duration-[5s] after:delay-75 " +
                        (active.index === index
                          ? " after:w-4 after:bg-white_primary/25 "
                          : " after:w-0 ")
                      }
                    ></li>
                  );
                })
              : null}
          </ul>
          <ChevronButton
            direction="left"
            className={
              "top-1/2 -translate-y-1/2 hidden sm:block " +
              ((indicatorScroll.elements[0]?.intersectionRatio || 0) < 0.9
                ? " opacity-100 "
                : " opacity-0 ")
            }
            onClick={() => {
              indicatorScroll.scrollToNextOffView("left");
            }}
          />
          <ChevronButton
            direction="right"
            className={
              "top-1/2 -translate-y-1/2 hidden sm:block " +
              ((indicatorScroll.elements.at(-1)?.intersectionRatio || 0) < 0.9
                ? " opacity-100 "
                : " opacity-0 ")
            }
            onClick={() => {
              indicatorScroll.scrollToNextOffView("right");
            }}
          />
        </div>
      ) : null}
    </>
  );
}
