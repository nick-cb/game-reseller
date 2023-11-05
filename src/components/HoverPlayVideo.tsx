import Link from "next/link";
import Video from "./Video";
import { Game, GameImageGroup } from "@/database/models";
import { FVideoFullInfo } from "@/actions/game/select";
import { currencyFormatter } from "@/utils";

export type FeatureCardItem = Pick<
  Game,
  "ID" | "name" | "slug" | "description" | "sale_price"
> & {
  videos: FVideoFullInfo[];
  images: GameImageGroup;
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
        <img
          className={
            "rounded transition-opacity duration-300 w-full h-full object-cover " +
            (hasVideos ? " hover:opacity-0 hover:pointer-events-none " : "")
          }
          src={item.images.landscape?.url + "?h=480&w=854&resize=1"}
          alt={""}
          width={854}
          height={480}
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
      <p>
        {item.sale_price === 0 ? "Free" : currencyFormatter(item.sale_price)}
      </p>
    </Link>
  );
}
