"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useBreakpoints } from "@/hooks/useBreakpoint";
import ChevronButton from "../ChevronButton";
import Video, { VideoPreview } from "../Video";

const InfiniteCarousel = ({
  images = [],
  videos = [],
}: {
  data?: any[];
  images: any[];
  videos: any[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndex = useRef(0);
  const previewListRef = useRef<HTMLUListElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);
  const userInteract = useRef(false);
  const data = videos.concat(images);
  const first = data[0];

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
    list.parentElement?.style.setProperty("overflow", "hidden");
    const { width } = list.getBoundingClientRect();
    list.style.setProperty(
      "transform",
      `translateX(-${width * (currentIndex % (data.length + 1))}px)`
    );
    const toElement = previewListRef.current?.querySelector<HTMLLIElement>(
      `li:nth-of-type(${currentIndex + 1})`
    );
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio < 1 && !userInteract.current) {
        previewListRef.current?.scroll({
          behavior: "smooth",
          left: toElement?.offsetLeft || 0,
        });
      }
    });
    if (toElement) {
      observer.observe(toElement);
    }

    // Don't schedule next transform if the current item is video
    if (data[currentIndex] && Array.isArray(data[currentIndex])) {
      return;
    }
    let id: ReturnType<typeof setTimeout>;
    const animationId = requestAnimationFrame(() => {
      if (currentIndex === data.length) {
        userInteract.current = false;
        id = setTimeout(() => {
          list.classList.remove("duration-300");
          list.classList.remove("transition-transform");
          list.style.setProperty("transform", `translateX(0)`);
          setTimeout(() => {
            list.classList.add("duration-300");
            list.classList.add("transition-transform");
          }, 300);
          setCurrentIndex(0);
        }, 300);
      } else {
        id = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % (data.length + 1));
        }, 5000);
      }
    });
    return () => {
      cancelIdleCallback(animationId);
      clearTimeout(id);
      observer.disconnect();
    };
  }, [currentIndex]);

  const { b640 } = useBreakpoints([640]);

  useEffect(() => {
    if (data.length <= 1) {
      return;
    }
    if (b640 >= 0) {
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
      <div className="flex overflow-scroll scrollbar-hidden snap-x snap-mandatory">
        <ul
          ref={listRef}
          className="transition-transform duration-300
          flex w-full"
        >
          {videos.map((vid, index) => (
            <li className="w-full shrink-0 snap-start" key={index}>
              <div className="relative w-full aspect-video">
                <Video
                  video={vid}
                  autoPlay
                  muted
                  onEnded={() => {
                    setTimeout(() => {
                      setCurrentIndex((prev) => prev + 1);
                    }, 3000);
                  }}
                />
              </div>
            </li>
          ))}
          {images.map((img, index) => (
            <li className="w-full shrink-0 snap-start" key={index}>
              <div className="relative w-full aspect-video">
                <Image src={img.url} alt={img.type} className="rounded" fill />
              </div>
            </li>
          ))}
          {first ? (
            Array.isArray(first) ? (
              <li className="w-full shrink-0 snap-start" key={"last"}>
                <div className="relative w-full aspect-video">
                  <Video video={first} />
                </div>
              </li>
            ) : (
              <li className="relative w-full aspect-video">
                <Image
                  src={first.url}
                  alt={first.type}
                  className="rounded"
                  fill
                />
              </li>
            )
          ) : null}
        </ul>
      </div>
      {/* {data.length > 1 ? ( */}
      {/*   <div className="relative flex justify-center mt-4"> */}
      {/*     <ul */}
      {/*       className="py-[1px] px-[1px] relative */}
      {/*     overflow-auto snap-x snap-mandatory scrollbar-hidden */}
      {/*     col-start-1 col-end-3 scroll-p-2 [scrollbar-width:none] [-ms-overflw-style:none] */}
      {/*     gap-4 flex w-max max-w-full" */}
      {/*       ref={previewListRef} */}
      {/*       onScroll={() => { */}
      {/*         const { current } = previewListRef; */}
      {/*         if (!current) { */}
      {/*           return; */}
      {/*         } */}
      {/*         if ((current.scrollLeft || 0) <= 0) { */}
      {/*           leftButtonRef.current?.style.setProperty("opacity", "0"); */}
      {/*         } else { */}
      {/*           leftButtonRef.current?.style.setProperty("opacity", "1"); */}
      {/*         } */}
      {/*         if ( */}
      {/*           (current.scrollLeft || 0) >= */}
      {/*           current.scrollWidth - current.clientWidth */}
      {/*         ) { */}
      {/*           rightButtonRef.current?.style.setProperty("opacity", "0"); */}
      {/*         } else { */}
      {/*           rightButtonRef.current?.style.setProperty("opacity", "1"); */}
      {/*         } */}
      {/*       }} */}
      {/*     > */}
      {/*       <div */}
      {/*         ref={outlineRef} */}
      {/*         className={"gameid-preview-outline hidden sm:block"} */}
      {/*       /> */}
      {/*       {data.map((image: any, index: number) => { */}
      {/*         return ( */}
      {/*           <li */}
      {/*             key={index} */}
      {/*             onClick={(e) => { */}
      {/*               setCurrentIndex(index); */}
      {/*               e.currentTarget.scrollIntoView({ */}
      {/*                 behavior: "smooth", */}
      {/*                 block: "nearest", */}
      {/*                 inline: "center", */}
      {/*               }); */}
      {/*             }} */}
      {/*           > */}
      {/*             <div */}
      {/*               className={`relative  */}
      {/*             w-4 h-1 rounded bg-paper sm:h-auto sm:w-24 sm:aspect-video snap-start */}
      {/*             md:after:content-[none] after:absolute after:top-0 after:bottom-0 after:bg-white/25 after:rounded */}
      {/*             ${ */}
      {/*               currentIndex % data.length === index */}
      {/*                 ? "sm:outline-1 after:animate-[animate-full-width_5s_linear]" */}
      {/*                 : "" */}
      {/*             }`} */}
      {/*             > */}
      {/*               <Image */}
      {/*                 src={image.url} */}
      {/*                 alt={image.type} */}
      {/*                 className="rounded hidden sm:block" */}
      {/*                 fill */}
      {/*               /> */}
      {/*             </div> */}
      {/*           </li> */}
      {/*         ); */}
      {/*       })} */}
      {/*     </ul> */}
      {/*     <ChevronButton */}
      {/*       direction="left" */}
      {/*       className="top-1/2 -translate-y-1/2 hidden sm:block" */}
      {/*       ref={leftButtonRef} */}
      {/*       onClick={() => { */}
      {/*         const previewList = previewListRef.current; */}
      {/*         if (!previewList) { */}
      {/*           return; */}
      {/*         } */}
      {/*         if (previewList.scrollLeft <= 0) { */}
      {/*           return; */}
      {/*         } */}
      {/*         userInteract.current = true; */}
      {/*         previewList.scroll({ */}
      {/*           left: previewList.scrollLeft - 100, */}
      {/*           behavior: "smooth", */}
      {/*         }); */}
      {/*       }} */}
      {/*     /> */}
      {/*     <ChevronButton */}
      {/*       direction="right" */}
      {/*       className="top-1/2 -translate-y-1/2 hidden sm:block opacity-100" */}
      {/*       ref={rightButtonRef} */}
      {/*       onClick={() => { */}
      {/*         const previewList = previewListRef.current; */}
      {/*         if (!previewList) { */}
      {/*           return; */}
      {/*         } */}

      {/*         if ( */}
      {/*           previewList.scrollLeft >= */}
      {/*           previewList.scrollWidth - previewList.clientWidth */}
      {/*         ) { */}
      {/*           return; */}
      {/*         } */}
      {/*         userInteract.current = true; */}
      {/*         previewListRef.current?.scroll({ */}
      {/*           left: previewList.scrollLeft + 100, */}
      {/*           behavior: "smooth", */}
      {/*         }); */}
      {/*       }} */}
      {/*     /> */}
      {/*   </div> */}
      {/* ) : null} */}
    </>
  );
};

export default InfiniteCarousel;
