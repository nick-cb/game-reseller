import { GameImages } from "@/database/models";
import { OmitGameId } from "@/actions/game/select";
import { LandscapeImages, PortraitImages } from "../config";

export function groupImages(images: OmitGameId<GameImages>[]) {
  const landscape = images.find((img) => {
    const type = img.type.toLowerCase();
    return LandscapeImages.includes(type);
  }) as GameImages;
  const portrait = images.find((img) => {
    const type = img.type.toLowerCase();
    return PortraitImages.includes(type);
  }) as GameImages;
  const logo = images.find((img) =>
    img.type.toLowerCase().includes("logo"),
  ) as GameImages;

  return {
    landscape,
    portrait,
    logo,
  };
}
