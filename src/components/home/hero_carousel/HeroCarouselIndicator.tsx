import { HeroCarouselGame } from '@/components/home/hero_carousel/Description';
import { ScrollBulletIndicator } from '@/components/scroll2/Indicators';
import React from 'react';
import { Indicator, IndicatorList } from '@/components/home/hero_carousel/Carousel';
import Image from 'next/image';

export function MobileIndicator({ data }: { data: HeroCarouselGame[] }) {
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

export function DesktopIndicator({ data }: { data: HeroCarouselGame[] }) {
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
          <div className="flex h-full w-full items-center gap-4 p-2 focus:bg-paper_2 lg:p-3">
            <div className="relative z-[1] aspect-[0.75] h-full shrink-0 overflow-hidden rounded-lg">
              {item.images.portraits[0].url && (
                <Image
                  alt=""
                  className="absolute"
                  src={decodeURIComponent(item.images.portraits[0].url)}
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
