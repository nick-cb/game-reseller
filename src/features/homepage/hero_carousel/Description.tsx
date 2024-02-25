import { Game, GameImageGroup } from "@/database/models";
import React from "react";

export type HeroCarouselGame = Pick<
  Game,
  "ID" | "name" | "slug" | "description" | 'avg_rating' | 'developer'
> & {
  images: GameImageGroup;
};
export const Description = ({ game }: { game: HeroCarouselGame }) => {
  return (
    <div className="max-w-sm flex flex-col justify-evenly flex-grow">
      <div
        className="w-36 lg:w-80 aspect-video relative logo"
        style={{
          backgroundImage: game.images.logo?.url
            ? `url(${decodeURIComponent(game.images.logo.url)})`
            : "",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom left",
        }}
      >
        {/* <Image src={} alt="" fill className="object-contain" /> */}
      </div>
      <p className="text-white_primary lg:text-lg hidden sm:block">
        {game.description?.split(".")[0]}
      </p>
    </div>
  );
};
