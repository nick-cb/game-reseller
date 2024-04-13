import './hero-carousel.css';
import React, { PropsWithChildren } from 'react';
import { ScrollItem } from '@/components/scroll2/ScrollPrimitive';
import { HCarousel } from './Carousel';
import { HeroCarouselImage } from './HeroCarouselImage';
import { HeroCarouselDesktopCover, HeroCarouselMobileCover } from './HeroCarouselCover';
import {
  DesktopIndicator,
  MobileIndicator,
} from '@/components/home/hero_carousel/HeroCarouselIndicator';
import { groupImages } from '@/utils/data';
import HomeActions from '@/actions2/home-actions';

type HeroCarouselProps = {
  className?: string;
};
export async function HeroCarousel({ className = '' }: PropsWithChildren<HeroCarouselProps>) {
  const { data } = await HomeActions.category.getHeroCarousel();
  const { game_list } = data;
  const gameList = game_list.map((game) => {
    return {
      ...game,
      images: groupImages(game.images),
    };
  });

  return (
    <div className={'gap-4 sm:flex lg:gap-8 ' + className}>
      <HCarousel
        length={gameList.length}
        Indicator={
          <>
            <MobileIndicator data={gameList} />
            <DesktopIndicator data={gameList} />
          </>
        }
      >
        {gameList.map((item, index) => (
          <ScrollItem
            key={item.ID}
            index={index}
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
