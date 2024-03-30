'use client';

import { mergeCls } from '@/utils';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import React from 'react';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
  useIntersectionObserver,
} from '@/components/intersection/IntersectionObserver';
import { FVideoFullInfo, OmitGameId } from '@/actions/game/select';
import { GameImages } from '@/database/models';
import { ShowOnBreakpoints } from '@/components/HideOnBreakpoints';
import { breakpoints, isVideo } from '@/components/game/game-item-carousel/GameItemCarousel';

export type NextPrevControlsProps = {
  totalItems: number;
};

export function NextPrevControls(props: NextPrevControlsProps) {
  const { totalItems } = props;
  const { entries } = useIntersectionObserver();
  const active = entries.findIndex((entry) => entry.intersectionRatio > 0.5);

  function goToItem(event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) {
    const index = parseInt(event.currentTarget.dataset.index || '0');
    entries[index].target.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <div className="controls absolute inset-0">
      <div
        className={mergeCls(
          'absolute z-[1] flex h-full w-12 items-center justify-center',
          'left-0  bg-gradient-to-r',
          'from-paper_3/40 to-default/0',
          '-translate-x-full transition-transform group-hover:translate-x-0'
        )}
      >
        <button
          data-index={Math.max(0, Math.min(totalItems, active - 1))}
          onClick={goToItem}
          className="flex h-10 w-8 items-center justify-center rounded outline-1 focus:outline "
        >
          <Icon name="arrow-left-s" variant="line" fill="white" />
        </button>
      </div>
      <div
        className={mergeCls(
          'absolute z-[1] flex h-full w-12 items-center justify-center',
          'right-0 bg-gradient-to-l',
          'from-paper_3/40 to-default/0',
          'translate-x-full transition-transform group-hover:translate-x-0'
        )}
      >
        <button
          data-index={Math.max(0, Math.min(totalItems - 1, active + 1))}
          onClick={goToItem}
          className="flex h-10 w-8 items-center justify-center rounded outline-1 focus:outline "
        >
          <Icon name="arrow-right-s" variant="line" fill="white" />
        </button>
      </div>
    </div>
  );
}

export type IndicatorProps = {
  item: OmitGameId<FVideoFullInfo> | OmitGameId<GameImages>;
  index: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function Indicator(props: IndicatorProps) {
  const { item, index, onClick } = props;
  return (
    <li>
      <button
        className={mergeCls(
          'relative flex h-14 w-24 snap-start items-center justify-center rounded bg-default transition-opacity'
          // active.index === index && ' opacity-100 outline outline-1'
        )}
        data-index={index}
        onClick={onClick}
      >
        <Image
          src={isVideo(item) ? item.thumbnail : item.url}
          alt={''}
          className="rounded sm:block"
          width={96}
          height={56}
        />
        {isVideo(item) ? <Icon name="play" className="absolute opacity-60" fill="white" /> : null}
      </button>
    </li>
  );
}

function IndicatorNextPrevButton() {
  return (
    <>
      <button
        className={mergeCls(
          'h-8 w-8 rounded-full bg-white/40',
          'absolute left-0 top-1/2 flex -translate-y-1/2',
          'items-center justify-center'
        )}
      >
        <Icon name="arrow-left-s" variant="line" fill="white" />
      </button>
      <button
        className={mergeCls(
          'h-8 w-8 rounded-full bg-white/40',
          'absolute right-0 top-1/2 flex -translate-y-1/2',
          'items-center justify-center'
        )}
      >
        <Icon name="arrow-right-s" variant="line" fill="white" />
      </button>
    </>
  );
}

export type IndicatorListProps = {
  videos: OmitGameId<FVideoFullInfo>[];
  images: OmitGameId<GameImages>[];
};

export function IndicatorList(props: IndicatorListProps) {
  const { videos, images } = props;
  const { entries } = useIntersectionObserver();

  function click(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const index = parseInt(event.currentTarget.dataset.index || '0');
    entries[index].target.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <IntersectionObserverContainer>
      <div className="relative mt-4 flex justify-center">
        <IntersectionObserverRoot>
          <ul
            className={mergeCls(
              'scrollbar-hidden relative col-start-1 col-end-3 flex w-max max-w-[calc(100%-80px)]',
              'snap-x snap-mandatory scroll-p-2 gap-4 overflow-y-visible overflow-x-scroll rounded',
              'px-2 py-[1px] [-ms-overflw-style:none] [scrollbar-width:none]'
            )}
          >
            <ShowOnBreakpoints from={breakpoints}>
              {videos.map((vid, index) => {
                return (
                  <Indicator key={'video-' + vid.ID} index={index} item={vid} onClick={click} />
                );
              })}
            </ShowOnBreakpoints>
            {images.map((img, index) => {
              return (
                <Indicator
                  key={'img-' + img.ID}
                  item={img}
                  index={videos.length + index}
                  onClick={click}
                />
              );
            })}
          </ul>
        </IntersectionObserverRoot>
        <IndicatorNextPrevButton />
      </div>
    </IntersectionObserverContainer>
  );
}
