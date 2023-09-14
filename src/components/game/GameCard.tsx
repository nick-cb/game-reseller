import Image from "next/image";
import Link from "next/link";
import React from "react";

const GameCard = ({
  game,
  type,
}: {
  game: any;
  type: "base" | "edition" | "add-on";
}) => {
  const landscapeImage = game.images.find((g: any) => {
    const type = g.type.toLowerCase();
    return type.includes("landscape") || type.includes("wide");
  });
  return (
    <div className="game-card grid grid-cols-5 rounded overflow-hidden bg-paper_2">
      <Link href={`/${game.slug}`} className="contents">
        <div className="col-start-1 col-end-6 sm:col-end-3 w-full aspect-video h-full relative">
          <Image
            src={landscapeImage?.url}
            alt={`landscape of ${type} ${game.name}`}
            fill
          />
        </div>
        <div
          className="row-start-2 sm:row-start-1 col-start-1 sm:col-start-3 col-end-6
        py-4 px-4 sm:px-2 md:px-4 lg:px-8
        text-white_primary
        flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <p className="py-1 px-2 bg-paper w-max text-xs text-white_primary rounded self-start whitespace-nowrap">
              {type.toUpperCase()}
            </p>
            <p className="text-sm">{game.name}</p>
          </div>
          <summary className="text-xs lg:text-sm text-white/60 list-none line-clamp-2 md:line-clamp-3 lg:line-clamp-4">
            {game.description}
          </summary>
        </div>
      </Link>
      <div
        className="row-start-3 col-start-1 col-end-6 sm:row-start-2
        border-t border-white/20
        py-2 sm:py-4 px-4
        flex sm:flex-row flex-col justify-end sm:items-center
        gap-2 sm:gap-4"
      >
        <p className="text-white_primary">
          {game.sale_price ? "$" + game.sale_price : "Free"}
        </p>
        <button className="bg-primary text-white py-2 w-full sm:w-44 rounded hover:brightness-105 transition-[filter]">
          Buy now
        </button>
        <button
          className="text-sm
          py-2 w-full sm:w-44 rounded border
          border-white/60 text-white hover:bg-paper transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default GameCard;
