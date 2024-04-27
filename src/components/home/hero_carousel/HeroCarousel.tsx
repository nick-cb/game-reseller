import HomeActions from '@/actions2/home-actions';
import {
  DesktopIndicator,
  MobileIndicator,
} from '@/components/home/hero_carousel/HeroCarouselIndicator';
import { ScrollItem } from '@/components/scroll2/ScrollPrimitive';
import { HCarousel } from './Carousel';
import { HeroCarouselDesktopCover, HeroCarouselMobileCover } from './HeroCarouselCover';
import { HeroCarouselImage } from './HeroCarouselImage';
import './hero-carousel.css';

export async function HeroCarousel() {
  const { data } = await HomeActions.collections.getHeroCarousel2();
  const { game_list } = data;

  return (
    <div className={'gap-4 sm:flex lg:gap-8'}>
      <HCarousel
        length={game_list.length}
        Indicator={
          <>
            <MobileIndicator data={game_list} />
            <DesktopIndicator data={game_list} />
          </>
        }
      >
        {game_list.map((item, index) => (
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
              desktopSrc={[item.images.landscapes[0]?.url]}
              mobileSrc={[item.images.portraits[0]?.url]}
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
