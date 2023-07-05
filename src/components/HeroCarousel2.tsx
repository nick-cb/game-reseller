"use client";
import "./hero-carousel2.css";
import Image from "next/image";

import React, { useEffect, useMemo, useRef, useState } from "react";

const HeroCarousel2 = ({ data }: { data: any[] }) => {
  const [index, setIndex] = useState(-1);
  let prev = useRef(0);
  const mainListRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);

  const _data = useMemo(() => {
    return data[0]?.list_game.slice(0, 6).map((game: any) => ({
      ...game,
      image: {
        landscape: game.images.find((img: any) => img.type === "landscape"),
        portrait: game.images.find((img: any) => img.type === "portrait"),
        logo: game.images.find((img: any) => img.type === "logo"),
      },
    }));
  }, [data]);

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
        setIndex((prev) => (index === -1 ? 1 : (prev + 1) % _data.length));
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
    <div className="flex gap-8">
      <div className="w-4/5 aspect-video overflow-scroll rounded-lg relative scrollbar-hidden snap-x snap-mandatory">
        <ul className="main-list h-full" ref={mainListRef}>
          {_data.map((item: any) => (
            <li key={item._id} className={"main-item snap-start"}>
              <Image
                className="rounded-lg"
                src={item.image.landscape.url}
                alt=""
                fill
              />
              <Cover game={item} />
            </li>
          ))}
        </ul>
      </div>
      <ul ref={previewListRef} className="flex flex-col flex-grow gap-2">
        {_data.map((item: any, itemIndex: any) => (
          <li
            key={item._id}
            className="hero-carousel-preview-item w-full h-full relative rounded-xl overflow-hidden
            after:absolute after:inset-0 hover:bg-paper_2 after:bg-paper"
            onClick={() => {
              if (itemIndex === prev.current) {
                return;
              }
              onClick(itemIndex);
            }}
          >
            <a
              className="flex items-center gap-4 h-full focus:bg-paper_2 p-3"
              href="#"
            >
              <div className="relative h-full aspect-[0.75] rounded-lg overflow-hidden z-[1]">
                <img
                  className="absolute h-full aspect-[0.75]"
                  src={item.image.portrait.url}
                />
              </div>
              <p className="text-sm text-white_primary z-[1]">{item.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Cover = ({ game }: { game: any }) => {
  return (
    <div className="main-item-cover absolute inset-0 flex flex-col-reverse p-8 justify-between gap-8">
      <div className="flex gap-4">
        <a
          href={`${game._id}`}
          className="bg-white text-default w-40 py-4 rounded text-sm text-center"
        >
          BUY NOW
        </a>
        <a
          href="#"
          className="relative overflow-hidden text-white w-40 py-4 rounded text-sm z-10
          hover:bg-white/[0.16] transition-colors duration-200 
          text-center"
        >
          ADD TO WISHLIST
        </a>
      </div>
      <div className="max-w-sm flex flex-col justify-evenly flex-grow">
        <img
          src={game.image?.logo.url}
          className="w-44 aspect-square object-contain"
        />
        <p className="text-white_primary text-lg">
          {game.description.split(".")[0]}
        </p>
      </div>
    </div>
  );
};

export default HeroCarousel2;
