import Link from "next/link";
import React from "react";
import { currencyFormatter } from "@/utils";
import { ScrollItem } from "@/components/scroll/index";

const PortraitGameCard = ({
  game,
  className = "",
  contentContainerClassName = "",
}: {
  game: any;
  className?: string;
  contentContainerClassName?: string;
}) => {
  return (
    <Link
      href={`/${game.slug}`}
      key={game.slug}
      className={className + " group"}
    >
      <ScrollItem
        as="div"
        className={
          contentContainerClassName +
          " " +
          "group cursor-pointer h-full flex flex-col justify-between"
        }
      >
        <div
          className={
            "relative xs-right-pad:aspect-[3/4] overflow-hidden " +
            "after:rounded after:absolute after:inset-0 after:w-full after:h-full " +
            "after:transition-opacity after:bg-white after:opacity-0 " +
            "group-hover:after:opacity-[0.1] bg-white/25 rounded " +
            "h-28 xs-right-pad:h-auto "
          }
        >
          <img
            src={game.images.portrait?.url + "?h=480&w=360&resize=1"}
            alt={`portrait of ${game.name}`}
            className={
              "rounded group-focus:scale-110 duration-300 transition-transform" +
              "w-full h-full object-cover "
            }
            width={360}
            height={480}
          />
        </div>
        <p className="mt-4 text-sm text-white_primary">{game.name}</p>
        <p className="text-xs mt-1 text-white/60">{game.developer}</p>
        <p className="text-sm mt-2 text-white_primary">
          {parseInt(game.sale_price) === 0
            ? "Free"
            : currencyFormatter(game.sale_price)}
        </p>
      </ScrollItem>
    </Link>
  );
};

export default PortraitGameCard;
