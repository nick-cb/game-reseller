import { GameImages } from "@/database/models";
import { OmitGameId } from "@/database/repository/game/select";

export function groupImages(images: OmitGameId<GameImages>[]) {
  const landscape = images.find((img) => {
    const type = img.type.toLowerCase();
    return (
      type.includes("landscape") ||
      type.includes("carousel") ||
      type.includes("wide")
    );
  });
  const portrait = images.find((img) => {
    const type = img.type.toLowerCase();
    return (
      type.includes("portrait") ||
      type.includes("thumbnail") ||
      type.includes("tall")
    );
  }) as GameImages;
  const logo = images.find((img) => img.type.toLowerCase().includes("logo"));

  return {
    landscape,
    portrait,
    logo,
  };
}
