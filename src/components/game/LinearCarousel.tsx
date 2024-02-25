"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import ChevronButton from "../ChevronButton";
import { useBreakpoints } from "@/hooks/useBreakpoint";
import { FVideoFullInfo, OmitGameId } from "@/actions/game/select";
import { GameImages } from "@/database/models";
import { ScrollItem } from "@/components/scroll/index";
import { useScroll, useScrollFactory } from "@/components/scroll/hook";
// import { BasicVideo } from "../video/Video";

const priority = {
  low: 3,
  medium: 2,
  high: 1,
  audio: 0,
}
const isVideo = (
  media: OmitGameId<GameImages> | OmitGameId<FVideoFullInfo>,
): media is OmitGameId<FVideoFullInfo> => {
  return "recipes" in media;
};
const SLIDE_INTERVAL = 5000;
const breakpoints = [640, 1536] as const;
export default function LinearCarousel({
  images = [],
  videos = [],
}: {
  images: OmitGameId<GameImages>[];
  videos: OmitGameId<FVideoFullInfo>[];
}) {
  const data = useMemo(() => {
    const _data: (OmitGameId<FVideoFullInfo> | OmitGameId<GameImages>)[] = [];
    return _data.concat(videos).concat(images);
  }, [images, videos]);

  const { b640: sm } = useBreakpoints(breakpoints);
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
    if (isVideo(data[active.index]) && sm >= 0) {
      return;
    }
    let timeOut: ReturnType<typeof setTimeout>;
    const animationFrame = requestAnimationFrame(() => {
      timeOut = setTimeout(() => {
        const nextIndex = (active.index + 1) % data.length;
        if (nextIndex === data.length) {
          // goToItem(0);
        } else {
          // goToItem(nextIndex);
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
              "left-0  bg-gradient-to-r " +
              "from-paper_3/40 to-default/0 " +
              "transition-transform -translate-x-full group-hover:translate-x-0 "
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
              "right-0  bg-gradient-to-l " +
              "from-paper_3/40 to-default/0 " +
              "transition-transform translate-x-full group-hover:translate-x-0 "
            }
          >
            <button
              onClick={() => {
                goToItem(active.index + 1);
              }}
              className="w-8 h-10 flex justify-center items-center focus:outline outline-1 rounded "
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
          className="flex overflow-scroll snap-mandatory snap-x scrollbar-hidden"
        >
          {sm >= 0
            ? videos.map((vid, index) => (
                <ScrollItem
                  key={index}
                  as={"li"}
                  className="rounded overflow-hidden w-full shrink-0 snap-start"
                >
                  {/* <BasicVideo */}
                  {/*   sources={vid.recipes.filter(({recipe}) => !recipe?.includes("hls")).map(({variants}) => { */}
                  {/*     return variants.sort((a, b) => priority[b.media_key] - priority[a.media_key])[0].url; */}
                  {/*   })} */}
                  {/*   audioSources={vid.recipes.filter(({recipe}) => !recipe?.includes("hls")).map(({variants}) => { */}
                  {/*     return variants.find(({media_key}) => media_key === "audio")?.url || ''; */}
                  {/*   })} */}
                  {/* /> */}
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
            className={
              "relative " +
              "overflow-x-scroll overflow-y-visible snap-x snap-mandatory scrollbar-hidden " +
              "col-start-1 col-end-3 [scrollbar-width:none] [-ms-overflw-style:none] " +
              "gap-4 flex w-max max-w-[calc(100%-80px)] px-2 scroll-p-2 rounded py-[1px] "
            }
          >
            {sm >= 0
              ? data.map((item, index) => {
                  return (
                    <ScrollItem
                      key={index}
                      as="li"
                      factory={factory}
                      onClick={() => {
                        goToItem(index);
                      }}
                    >
                      <button
                        className={
                          "relative transition-opacity w-24 h-14 rounded bg-default flex items-center justify-center snap-start " +
                          (active.index === index
                            ? " opacity-100 outline outline-1 "
                            : "")
                        }
                      >
                        <Image
                          src={isVideo(item) ? item.thumbnail : item.url}
                          alt={isVideo(item) ? "" : item.alt}
                          className="rounded sm:block"
                          width={96}
                          height={56}
                        />
                        {isVideo(item) ? (
                          <svg
                            width={16}
                            height={16}
                            fill="white"
                            className="absolute"
                          >
                            <use
                              width={16}
                              height={16}
                              xlinkHref={"/svg/sprites/actions.svg#play"}
                            />
                          </svg>
                        ) : null}
                      </button>
                    </ScrollItem>
                  );
                })
              : data.map((item, index) => {
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
                })}
          </ul>
          <ChevronButton
            direction="left"
            className={"top-1/2 -translate-y-1/2 hidden sm:flex"}
            onClick={() => {
              indicatorScroll.scrollToNextOffView("left");
            }}
          />
          <ChevronButton
            direction="right"
            className={"top-1/2 -translate-y-1/2 hidden sm:flex"}
            onClick={() => {
              indicatorScroll.scrollToNextOffView("right");
            }}
          />
        </div>
      ) : null}
    </>
  );
}
