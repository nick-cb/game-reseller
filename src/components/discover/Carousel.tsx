import React from "react";
import PortraitGameCard from "../PortraitGameCard";
import Link from "next/link";
// import { Game, GameImageGroup } from "@/database/models";
// import { FVideoFullInfo } from "@/actions/game/select";
import { CarouselButton } from "./Carouse.client";
import { getCollectionByKey, getCollectionByKey2 } from "@/actions/collections";
import { Scroll } from "../scroll";
import { groupImages } from "@/utils/data";

// type CarouselGame = Pick<
//   Game,
//   | "ID"
//   | "name"
//   | "slug"
//   | "developer"
//   | "avg_rating"
//   | "sale_price"
//   | "description"
// > & {
//   images: GameImageGroup;
//   videos: FVideoFullInfo[];
// };
type CarouselProps = {
  name: string;
  // collection: Collections & {
  //   list_game: CarouselGame[];
  // };
};

/**
 * @params name: Object
 * */
async function Carousel({ name }: CarouselProps) {
  const { data } = await getCollectionByKey2([name]);
  const collection = data[0] || [];

  return (
    <Scroll containerSelector={"#" + collection.collection_key}>
      <div className={"flex justify-between mb-4"}>
        <Link
          className="text-white text-lg flex items-center group gap-2 w-max pr-4"
          href={`/browse?collection=${collection.collection_key}`}
        >
          {collection.name[0].toUpperCase() + collection.name.substring(1)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16px"
            height="16px"
            className="group-hover:translate-x-2 transition-transform"
          >
            <g id="Icon">
              <path
                fill="white"
                d="M5.53,16.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
                className="transition-colors"
              />
            </g>
          </svg>
        </Link>
        <div className={"flex items-center gap-2"}>
          <CarouselButton />
        </div>
      </div>
      <div className="relative">
        <div
          id={collection.collection_key}
          className="flex gap-4 overflow-scroll scrollbar-hidden
          snap-x snap-mandatory grid-cols-10"
        >
          <div
            style={{ inlineSize: "208px" }}
            className="shrink-0 xs-right-pad:hidden"
          />
          {collection.list_game.map((game) => (
            <PortraitGameCard
              key={game.ID}
              game={{ ...game, images: groupImages(game.images) }}
              className="snap-start last-of-type:snap-end flex-shrink-0
              w-[calc(calc(100vw_-_32px)/2_-_13px)]
              3/4sm:w-[calc(calc(100vw_-_32px)/3_-_13px)]
              sm:w-[calc(calc(100vw_-_32px)/4_-_13px)]
              md:w-[calc(calc(100vw_-_32px)/4_-_13px)]
              lg:w-[calc(calc(100vw_-_192px)/5_-_13px)]
              xl:w-[calc(calc(100vw_-_352px)/5_-_13px)]
              2xl:w-[calc(calc(100vw_-_352px)/7_-_13px)]
              4xl:w-[calc(calc(100vw_-_352px)/9_-_13px)]"
            />
          ))}
          <div
            style={{ inlineSize: "208px" }}
            className="shrink-0 xs-right-pad:hidden"
          />
        </div>
      </div>
    </Scroll>
  );
}

export default Carousel;
