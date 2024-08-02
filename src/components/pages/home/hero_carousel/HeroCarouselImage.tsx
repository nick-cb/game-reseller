type HeroCarouselImageProps = {
  desktopSrc: string[];
  mobileSrc: string[];
};
export function HeroCarouselImage(props: HeroCarouselImageProps) {
  const { desktopSrc, mobileSrc } = props;
  return (
    <picture className="w-full h-full">
      {desktopSrc.map((src, index) => {
        return (
          <source
            key={index}
            media="(min-width:640px)"
            srcSet={decodeURIComponent(src) + '?h=900&w=1440&quality=medium&resize=1 640w'}
            width={1280}
            height={720}
            className="object-cover"
          />
        );
      })}
      {mobileSrc.map((src, index) => {
        return (
          <img
            key={index}
            srcSet={decodeURIComponent(src) + '?h=960&w=720&quality=medium&resize=1'}
            width={640}
            height={960}
            className="h-full w-full rounded-lg object-cover"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
        );
      })}
    </picture>
  );
}
