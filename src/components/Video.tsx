import Image from "next/image";
import { DetailedHTMLProps, VideoHTMLAttributes } from "react";

export default function Video({
  video,
  ...props
}: { video: any } & DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>) {
  const thumbnail = video.thumbnail;

  return (
    <video controls={true} poster={thumbnail.url} {...props}>
      {video.recipes.map((recipe: any) => {
        const lowestVariant = recipe.variants.find(
          (v: any) => v.key === "low" || v.key === "medium" || v.key === "high"
        );
        return (
          <source
            src={lowestVariant.url}
            onPlay={() => {
              console.log("play");
            }}
            type={lowestVariant.contentType}
          />
        );
      })}
    </video>
  );
}

export function VideoPreview({ video }: { video: any }) {
  const recipe = video[0];
  const thumbnail = recipe.outputs[1];

  return <Image src={thumbnail.url} alt={""} />;
}
