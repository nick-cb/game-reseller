import Link from "next/link";
import Image from "next/image";
import React from "react";

const PortraitGameCard = ({ game }: { game: any }) => {
  return (
    <Link href={`/${game._id}`} key={game._id}>
      <figure className="group cursor-pointer h-full flex flex-col justify-between">
        <div
          className="relative aspect-[3/4]
                    after:rounded after:absolute after:inset-0 after:w-full after:h-full 
                    after:transition-opacity after:bg-white after:opacity-0 
                    group-hover:after:opacity-[0.1]
                    "
        >
          <Image
            src={
              game.images.find((img: any) => {
                return img.type === "portrait";
              })?.url
            }
            alt={`portrait of ${game.name}`}
            className={"rounded relative"}
            fill
          />
        </div>
        <figcaption className="mt-4 text-sm text-white_primary">
          {game.name}
        </figcaption>
        <p className="text-xs mt-1 text-white/60">{game.developer}</p>
        <p className="text-sm mt-2 text-white_primary">${game.sale_price}</p>
      </figure>
    </Link>
  );
};

export default PortraitGameCard;
