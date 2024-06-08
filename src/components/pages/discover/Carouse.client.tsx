'use client';

import { Icon } from '@/components/Icon';
import { useScroll } from '@/components/scroll/ScrollPrimitive';

export function CarouselButton() {
  const { entries, firstVisibleIndex, lastVisibleIndex, scrollToIndex, scrollToNextOffView } =
    useScroll();

  return (
    <>
      <button
        data-index={Math.max(0, firstVisibleIndex - (lastVisibleIndex - firstVisibleIndex) - 1)}
        onClick={scrollToIndex}
        className="transition-color flex h-8 w-8 items-center justify-center rounded-full bg-paper_2 transition-colors hover:bg-white/20"
      >
        <Icon name="arrow-left-s" style={{ opacity: entries[0]?.isIntersecting ? 0.4 : 1 }} />
      </button>
      <button
        onClick={scrollToNextOffView}
        className="transition-color flex h-8 w-8 items-center justify-center rounded-full bg-paper_2 transition-colors hover:bg-white/20"
      >
        <Icon name="arrow-right-s" style={{ opacity: entries.at(-1)?.isIntersecting ? 0.4 : 1 }} />
      </button>
    </>
  );
}
