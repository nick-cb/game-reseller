import { LandscapeImages, PortraitImages } from '../config';

export function groupImages(images: GameImages[]) {
  let landscape: GameImages | undefined = undefined;
  let portrait: GameImages | undefined = undefined;
  let logo: GameImages | undefined = undefined;

  for (const image of images) {
    if (LandscapeImages.includes(image.type.toLowerCase()) && !landscape) {
      landscape = image;
    }
    if (PortraitImages.includes(image.type.toLowerCase()) && !portrait) {
      portrait = image;
    }
    if (image.type.toLowerCase().includes('logo') && !logo) {
      logo = image;
    }
  }

  return {
    landscape,
    portrait,
    logo,
  };
}
