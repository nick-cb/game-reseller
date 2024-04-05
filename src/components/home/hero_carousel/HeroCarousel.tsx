import './hero-carousel.css';
import React, { PropsWithChildren } from 'react';
import { ScrollItem } from '@/components/scroll2/ScrollPrimitive';
import { HCarousel } from './Carousel';
import { getHeroCarousel } from '@/components/home/hero_carousel/HeroCarousel.action';
import { groupImages } from '@/utils/data';
import { HeroCarouselImage } from './HeroCarouselImage';
import { HeroCarouselDesktopCover, HeroCarouselMobileCover } from './HeroCarouselCover';
import {
  DesktopIndicator,
  MobileIndicator,
} from '@/components/home/hero_carousel/HeroCarouselIndicator';

type HeroCarouselProps = {
  className?: string;
};
export async function HeroCarousel({ className = '' }: PropsWithChildren<HeroCarouselProps>) {
  const { data: heroCarousel = { list_game: [] } } = await getHeroCarousel();
  const listGame = heroCarousel.list_game.map((game) => {
    return {
      ...game,
      images: groupImages(game.images),
    };
  });

  return (
    <div className={'gap-4 sm:flex lg:gap-8 ' + className}>
      <HCarousel
        length={listGame.length}
        Indicator={
          <>
            <MobileIndicator data={listGame} />
            <DesktopIndicator data={listGame} />
          </>
        }
      >
        {listGame.map((item) => (
          <ScrollItem
            key={item.ID}
            className={
              'main-item relative snap-start ' +
              'flex flex-shrink-0 overflow-hidden rounded-xl ' +
              'w-11/12 sm:w-full'
            }
          >
            <HeroCarouselImage
              desktopSrc={[item.images.landscape.url]}
              mobileSrc={[item.images.portrait.url]}
            />
            <div
              className={
                'bg-gradient-to-t from-paper_3 via-paper_3/80 via-40% to-transparent ' +
                ' absolute  bottom-0 flex h-1/2 w-full items-end ' +
                ' pointer-events-none sm:hidden'
              }
            ></div>
            <HeroCarouselDesktopCover game={item} />
            <HeroCarouselMobileCover game={item} />
          </ScrollItem>
        ))}
      </HCarousel>
    </div>
  );
}

export default HeroCarousel;
