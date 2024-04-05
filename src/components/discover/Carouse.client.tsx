'use client';

import { useScroll } from '@/components/scroll2/ScrollPrimitive';

export function CarouselButton() {
  const { entries, scrollToPrevOffView, scrollToNextOffView } = useScroll();

  return (
    <>
      <button
        onClick={scrollToPrevOffView}
        className={
          'transition-color flex h-8 w-8 items-center justify-center rounded-full bg-paper_2 hover:bg-white/20 '
        }
      >
        <svg
          fill={'transparent'}
          stroke={entries[0]?.isIntersecting ? 'rgb(255 255 255 / 0.25)' : 'rgb(255 255 255)'}
          className="h-[32px] w-[32px] -rotate-90"
        >
          <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
        </svg>
      </button>
      <button
        onClick={scrollToNextOffView}
        className="transition-color flex h-8 w-8 items-center justify-center rounded-full bg-paper_2 hover:bg-white/20"
      >
        <svg
          fill={'transparent'}
          stroke={entries.at(-1)?.isIntersecting ? 'rgb(255 255 255 / 0.25)' : 'rgb(255 255 255)'}
          className="h-[32px] w-[32px] rotate-90"
        >
          <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
        </svg>
      </button>
    </>
  );
}
