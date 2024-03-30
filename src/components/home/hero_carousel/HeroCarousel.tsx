import './hero-carousel.css';
import Image from 'next/image';
import React, { PropsWithChildren } from 'react';
import { Description, HeroCarouselGame } from '@/components/home/hero_carousel/Description';
import { Scroll, ScrollBulletIndicator, ScrollItem } from '@/components/scroll';
import { Carousel, Indicator, IndicatorList } from './Carousel';
import { ButtonGroup } from './ButtonGroup';
import { Cover } from './Cover';
import { getHeroCarousel } from '@/components/home/hero_carousel/HeroCarousel.action';
import { groupImages } from '@/utils/data';

type HeroCarouselProps = {
  className?: string;
};
export async function HeroCarousel({ className = '' }: PropsWithChildren<HeroCarouselProps>) {
  const { data: heroCarousel = { list_game: [] } } = await getHeroCarousel();
  const data = heroCarousel.list_game.map((game) => {
    return {
      ...game,
      images: groupImages(game.images),
    };
  });

  return (
    <div className={'gap-4 sm:flex lg:gap-8 ' + className}>
      <Carousel
        length={data.length}
        Indicator={
          <>
            <MobileIndicator data={data} />
            <DesktopIndicator data={data} />
          </>
        }
      >
        {data.map((item, index) => (
          <ScrollItem
            key={item.ID}
            as="li"
            className={
              'main-item relative snap-start ' +
              'flex flex-shrink-0 overflow-hidden rounded-xl ' +
              'w-11/12 sm:w-full'
            }
          >
            <picture>
              <source
                media="(min-width:640px)"
                srcSet={
                  decodeURIComponent(item.images.landscape.url) +
                  '?h=900&quality=medium&resize=1&w=1440'
                }
                width={1280}
                height={720}
                className="object-cover"
              />
              <img
                srcSet={
                  decodeURIComponent(item.images.portrait.url) +
                  '?h=850&quality=medium&resize=1&w=640'
                }
                width={640}
                height={850}
                className="h-full w-full rounded-lg object-cover"
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </picture>
            <Cover className="hidden sm:flex">
              <ButtonGroup game={item} />
              <Description game={item} />
            </Cover>
            <div
              className={
                'bg-gradient-to-t from-paper_3 via-paper_3/80 via-40% to-transparent ' +
                ' absolute  bottom-0 flex h-1/2 w-full items-end ' +
                ' pointer-events-none sm:hidden'
              }
            ></div>
            <div className="absolute bottom-0 mt-auto grid h-max w-full gap-x-4 p-4 [grid-template-columns:max-content_auto] sm:hidden">
              <div
                className={
                  'relative flex w-16 items-center ' +
                  'p-1 before:absolute before:inset-0 before:rounded-lg before:bg-white/20 before:backdrop-blur-md ' +
                  'row-span-2 min-w-0 '
                }
              >
                <Image
                  src={item.images.logo?.url || ''}
                  alt=""
                  width={56}
                  height={56}
                  className="relative block h-14 w-14 rounded object-contain"
                  priority
                />
              </div>
              <div
                className={
                  'relative col-start-2 col-end-3 ' +
                  ' w-[calc(100%+16px)] min-w-0 overflow-hidden '
                }
              >
                <Scroll
                  containerSelector={'#' + item.slug.replace('/', '-') + '-infinite-scroll-text'}
                  infiniteScroll
                  observerOptions={{
                    threshold: 1,
                  }}
                >
                  <div
                    id={item.slug.replace('/', '-') + '-infinite-scroll-text'}
                    className="flex gap-10"
                  >
                    <ScrollItem
                      as={'p'}
                      className={'w-max whitespace-nowrap text-sm text-white_primary'}
                    >
                      {item.name}
                    </ScrollItem>
                  </div>
                </Scroll>
              </div>
              <div className="flex min-w-0 justify-between">
                <div>
                  <p className={'mb-1 text-xs text-white_primary/60'}>{item.developer}</p>
                  <p className={'flex items-center gap-[0.5ch] text-xs text-white_primary/60'}>
                    <svg
                      fill="none"
                      stroke="hsl(0 0% 96% / 0.6)"
                      width={14}
                      height={14}
                      className={'-translate-y-[1px]'}
                    >
                      <use strokeWidth={3} xlinkHref="/svg/sprites/actions.svg#star" />
                    </svg>
                    {item.avg_rating?.toString().split('.')[0] +
                      '.' +
                      item.avg_rating?.toString().split('.')[1].substring(0, 1)}
                  </p>
                </div>
                <button className="rounded bg-white px-4 py-2 text-sm text-default">Buy now</button>
              </div>
            </div>
          </ScrollItem>
        ))}
      </Carousel>
    </div>
  );
}

function MobileIndicator({ data }: { data: HeroCarouselGame[] }) {
  return (
    <ul className="flex w-full items-center justify-center gap-4 pt-4 sm:hidden">
      {data.map((item, index) => {
        return (
          <li key={item.ID}>
            <ScrollBulletIndicator index={index} />
          </li>
        );
      })}
    </ul>
  );
}

function DesktopIndicator({ data }: { data: HeroCarouselGame[] }) {
  return (
    <IndicatorList className="hidden flex-1 flex-col gap-2 sm:flex">
      {data.map((item, itemIndex) => (
        <Indicator
          key={item.ID}
          index={itemIndex}
          className="hero-carousel-preview-item relative h-full w-full overflow-hidden rounded-xl
            after:absolute after:inset-0 after:bg-paper hover:bg-paper_2"
          title={item.name}
        >
          <div
            className="flex h-full w-full items-center gap-4 p-2 focus:bg-paper_2 lg:p-3"
            // href="#"
          >
            <div className="relative z-[1] aspect-[0.75] h-full shrink-0 overflow-hidden rounded-lg">
              {item.images.portrait?.url && (
                <Image
                  alt=""
                  className="absolute"
                  src={decodeURIComponent(item.images.portrait.url)}
                  width={54}
                  height={72}
                />
              )}
            </div>
            <p className="z-[1] line-clamp-2 text-sm text-white_primary">{item.name}</p>
          </div>
        </Indicator>
      ))}
    </IndicatorList>
  );
}

export default HeroCarousel;
