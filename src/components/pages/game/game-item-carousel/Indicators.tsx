'use client';

import { mergeCls } from '@/utils';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import React, { useEffect } from 'react';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { isVideo } from '@/components/pages/game/game-item-carousel/GameItemCarousel';
import { useScroll, ScrollItem } from '@/components/scroll/ScrollPrimitive';

export type NextPrevControlsProps = {
  totalItems: number;
};

export function NextPrevControls() {
  const { scrollToNextOffView, scrollToPrevOffView } = useScroll();

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
          onClick={scrollToPrevOffView}
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
          onClick={scrollToNextOffView}
          className="flex h-10 w-8 items-center justify-center rounded outline-1 focus:outline "
        >
          <Icon name="arrow-right-s" variant="line" fill="white" />
        </button>
      </div>
    </div>
  );
}

export type IndicatorProps = {
  item: FindVideoItemResult | GameImages;
  index: number;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function Indicator(props: IndicatorProps) {
  const { entries, scrollToIndex } = useScroll();
  const { item, index, isActive, onClick } = props;

  useEffect(() => {
    if (!isActive || entries[index]?.isIntersecting) {
      return;
    }
    scrollToIndex(index);
  }, [isActive, index]);

  return (
    <button
      className={mergeCls(
        'relative flex h-14 w-24 snap-start items-center justify-center rounded bg-default transition-opacity',
        isActive && ' opacity-100 outline outline-1'
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
      {isVideo(item) ? <Icon name="play" className="absolute opacity-60" variant="fill" /> : null}
    </button>
  );
}

function IndicatorNextPrevButton() {
  const { entries, firstVisibleIndex, lastVisibleIndex, scrollToIndex, scrollToNextOffView } =
    useScroll();
  if (!entries[lastVisibleIndex + 1]) {
    return null;
  }
  return (
    <>
      <button
        data-index={Math.max(0, firstVisibleIndex - (lastVisibleIndex - firstVisibleIndex) - 1)}
        onClick={scrollToIndex}
        className={mergeCls(
          'h-8 w-8 rounded-full bg-white/40',
          'absolute left-0 top-1/2 flex -translate-y-1/2',
          'items-center justify-center'
        )}
      >
        <Icon name="arrow-left-s" variant="line" fill="white" />
      </button>
      <button
        onClick={scrollToNextOffView}
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
  videos: FindVideoArrayResult;
  images: GameImageGroup;
};

export function IndicatorList(props: IndicatorListProps) {
  const { videos, images } = props;
  const { entries, scrollToIndex } = useScroll();

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
            {videos.map((vid, index) => {
              return (
                <ScrollItem index={index} key={vid.ID} className="hidden sm:block">
                  <Indicator
                    key={'video-' + vid.ID}
                    index={index}
                    item={vid}
                    isActive={entries[index]?.isIntersecting}
                    onClick={scrollToIndex}
                  />
                </ScrollItem>
              );
            })}
            {images.landscapes.map((img, index) => {
              return (
                <ScrollItem index={videos.length + index} key={img.ID}>
                  <Indicator
                    key={'img-' + img.ID}
                    item={img}
                    index={videos.length + index}
                    isActive={entries[videos.length + index]?.isIntersecting}
                    onClick={scrollToIndex}
                  />
                </ScrollItem>
              );
            })}
          </ul>
        </IntersectionObserverRoot>
        <IndicatorNextPrevButton />
      </div>
    </IntersectionObserverContainer>
  );
}
