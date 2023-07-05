"use client";
import "./hero-carousel.css";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const HeroCarousel = ({ data }: { data: any[] }) => {
  const _data = useMemo(() => {
    return data[0]?.list_game.slice(0, 6).map((item: any) => ({
      ...item,
      image: item.images.find((img: any) => img.type === "landscape"),
    }));
  }, [data]);
  const [index, setIndex] = useState(-1);
  const prevIndex = useRef(0);
  const mainListRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
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
    const mainList = mainListRef.current;
    const previewList = previewListRef.current;
    if (!mainList || !previewList || index === -1) {
      return;
    }
    mainList.children.item(prevIndex.current)?.classList.remove("active");
    mainList.children.item(prevIndex.current)?.classList.add("not-active");
    mainList.children.item(index)?.classList.add("active");
    mainList.children.item(index)?.classList.remove("not-active");
    prevIndex.current = index;
  }, [index]);

  return (
    <div className="flex gap-8 mb-4 relative">
      <div className="relative w-[78%] scrollbar-hidden snap-x snap-mandatory rounded-xl overflow-scroll">
        <ul ref={mainListRef} className="hero-carousel flex aspect-video">
          {_data.map((game: any, itemIndex: number) => (
            <li
              key={game._id}
              id={`hero-carousel-item-${itemIndex}`}
              className={`hero-carousel-item relative w-full flex-shrink-0 overflow-hidden snap-start
              `}
            >
              <Image src={game.image.url} alt="" fill priority unoptimized />
              <div
                className="hero-carousel-info-cover absolute inset-0 p-8
                flex items-start flex-col-reverse rounded-b-md"
              >
                <div className="flex gap-4">
                  <a
                    href={`/${game._id}`}
                    className="bg-white text-default rounded text-sm w-40 py-4 text-center
                    "
                  >
                    BUY NOW
                  </a>
                  {/* <button */}
                  {/*   className="btn-hero-wishlist relative text-sm w-40 py-4 text-white rounded  */}
                  {/*   hover:shadow-[rgba(11,_11,_11,_0.1)] hover:shadow-md */}
                  {/*   after:transition-opacity after:duration-300 after:absolute  */}
                  {/*   after:inset-0 after:bg-white/[.16] hover:after:opacity-100  */}
                  {/*   after:rounded" */}
                  {/* > */}
                  {/*   ADD TO WISHLIST */}
                  {/* </button> */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ul ref={previewListRef} className="gap-1 flex flex-col flex-grow">
        {data[0]?.list_game.slice(0, 6).map((game: any, itemIndex: number) => (
          <li
            className="hero-carousel-preview-item relative flex-grow rounded-2xl overflow-hidden
            after:absolute after:inset-0 hover:bg-paper_2 after:bg-paper"
            onClick={() => {
              // mainList.children.item(itemIndex)?.classList.remove('not-active');
              // mainList.children.item(index)?.classList.remove('active');
              // mainList.children.item(itemIndex)?.classList.add("active");
              // const fadeout = mainList.children.item(index)?.animate(
              //   {
              //     transform: ["translateX(0px)", "translateX(-100px)"],
              //     opacity: [1, 0],
              //   },
              //   {
              //     duration: 200,
              //     easing: "ease-in-out",
              //   }
              // );
              // fadeout!.onfinish = () => {
              //   console.log(mainList.children.item(index));
              //   mainList.children.item(index)?.classList.remove("active");
              // };
              setIndex(itemIndex);
              // mainList.children
              //   .item(index === 0 ? 5 : index - 1)
              //   ?.classList.remove("active");
              // previewList.children.item(index)?.classList.remove("active");
              // setIndex(itemIndex);
            }}
          >
            <a
              className="flex h-full items-center 
              gap-4 p-3"
              href={`#hero-carousel-item-${itemIndex}`}
              onClick={() => {
                const previewList = previewListRef.current;
                const mainList = mainListRef.current;
                if (!mainList || !previewList) {
                  return;
                }
                // mainList.children
                //   .item(index === 0 ? 5 : index - 1)
                //   ?.classList.remove("active");
                // previewList.children.item(index)?.classList.remove("active");
                // setIndex(itemIndex);
              }}
              // onKeyDown={() => {

              // }}
            >
              <div className="relative h-full aspect-[0.75] rounded-lg overflow-hidden z-[1]">
                <Image
                  src={
                    game.images.find((img: any) => img.type === "portrait").url
                  }
                  alt=""
                  fill
                />
              </div>
              <p className="text-sm text-white_primary z-[1]">{game.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeroCarousel;
