import { HeroCarouselGame } from "@/components/pages/home/hero_carousel/Description";
import Link from "next/link";
import React from "react";

export const ButtonGroup = ({ game }: { game: HeroCarouselGame }) => {
  return (
    <div className="flex gap-4">
      <Link
        href={`${game.slug}/order`}
        className="bg-white text-default lg:w-40 w-36 py-3 lg:py-4 rounded text-sm text-center"
      >
        BUY NOW
      </Link>
      <a
        href="#"
        className="relative overflow-hidden text-white lg:w-40 w-36 py-3 lg:py-4 rounded text-sm z-10
          hover:bg-white/[0.16] transition-colors duration-200
          text-center"
      >
        ADD TO WISHLIST
      </a>
    </div>
  );
};
