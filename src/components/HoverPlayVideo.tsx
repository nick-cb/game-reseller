"use client";

import Link from "next/link";
import Image from "next/image";

export function HoverPlayVideo({ item }: { item: any }) {
  return (
    <li className="w-full group cursor-pointer">
      <Link href={"/" + item.slug}>
        <div
          className={`relative overflow-hidden aspect-video cols-min-1
                    after:rounded after:absolute after:inset-0 after:w-full after:h-full
                    after:transition-opacity after:bg-white after:opacity-0
                    group-hover:after:opacity-[0.1] bg-white/25 rounded group
                  `}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            const video = target.querySelector("video");
            console.log(video);
            video?.play();
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            const video = target.querySelector("video");
            if (video) {
              video.currentTime = 0;
            }
          }}
        >
          <video
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onPlay={() => {
              console.log("playing");
            }}
            muted={true}
          >
            <source src={item.videos[0].outputs[0].resVariant?.[1].url} />
          </video>
          <Image
            className="rounded group-hover:opacity-0 group-hover:pointer-events-none transition-opacity  duration-300"
            src={item.images.landscape.url}
            alt={""}
            fill
          />
        </div>
        <h2 className="text-white_primary py-4">{item.name}</h2>
        <p className="text-white/60 text-sm mb-2">{item.description}</p>
        <p>{item.sale_price}</p>
      </Link>
    </li>
  );
}
