import Link from "next/link";
import Image from "next/image";
import Video from "./Video";
import { Game, GameImages } from "@/database/models";
import { FVideoFullInfo } from "@/database/repository/game/select";

export type FeatureCardItem = Pick<
  Game,
  "ID" | "name" | "slug" | "description" | "sale_price"
> & {
  videos: FVideoFullInfo[];
  images: {
    portrait: GameImages | undefined;
    landscape: GameImages;
    logo: GameImages | undefined;
  };
};
type FeatureCardProps = {
  item: FeatureCardItem;
};
export function FeatureCard({ item }: FeatureCardProps) {
  const hasVideos = item.videos;

  return (
    <Link href={"/" + item.slug} className="relative">
      <div
        className={
          "relative overflow-hidden aspect-video cols-min-1 after:pointer-events-none " +
          "after:rounded after:absolute after:inset-0 after:w-full after:h-full " +
          "after:transition-opacity after:bg-white after:opacity-0 " +
          (hasVideos
            ? "hover:after:opacity-[0.1] bg-white/25 rounded group "
            : "")
        }
      >
        <Image
          className={
            "rounded transition-opacity duration-300 " +
            (hasVideos ? " hover:opacity-0 hover:pointer-events-none " : "")
          }
          src={item.images.landscape?.url}
          alt={""}
          fill
        />
        {hasVideos ? (
          <Video
            video={item.videos?.[0]}
            customControls={false}
            playOnHover
            containerClassName="opacity-0 hover:opacity-100"
          />
        ) : null}
      </div>
      <h2 className="text-white_primary py-4">{item.name}</h2>
      <p className="text-white/60 text-sm mb-2">{item.description}</p>
      <p>{item.sale_price === 0 ? "Free" : "đ" + item.sale_price}</p>
    </Link>
  );
}
