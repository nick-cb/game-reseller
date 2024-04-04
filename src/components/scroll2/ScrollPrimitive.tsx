'use client';

import React, { useEffect, useRef } from 'react';
import { mergeCls } from '@/utils';
import { useIntersectionObserver } from '../intersection/IntersectionObserver';
import { useVideo } from '../media/Video2';

export const ScrollContainer = React.forwardRef<HTMLUListElement, JSX.IntrinsicElements['ul']>(
  function (props, ref) {
    return <ul ref={ref} {...props} />;
  }
);

type ScrollItemProps = JSX.IntrinsicElements['li'] & {
  autoScrollInterval?: number;
};
export function ScrollItem(props: ScrollItemProps) {
  const { autoScrollInterval, ...rest } = props;
  const ref = useRef<HTMLLIElement>(null);
  const { observer, scrollToNextOffView } = useScroll();

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }
  }, [observer]);

  useEffect(() => {
    if (!autoScrollInterval) {
      return;
    }
    const id = setTimeout(() => {
      scrollToNextOffView({ cycle: true });
    }, autoScrollInterval);
    return () => {
      clearTimeout(id);
    };
  }, [autoScrollInterval, scrollToNextOffView]);

  return <li ref={ref} {...rest} />;
}
export function VideoScrollItem(props: ScrollItemProps) {
  const { autoScrollInterval, ...rest } = props;
  const { playing, currentTime, duration } = useVideo({
    events: ['loadedmetadata', 'play', 'pause'],
  });
  const { observer, scrollToNextOffView } = useScroll();
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }
  }, [observer]);

  useEffect(() => {
    let id: NodeJS.Timeout | undefined;
    if (!playing && currentTime > 0 && currentTime === duration) {
      id = setTimeout(() => {
        scrollToNextOffView({ cycle: true });
      }, autoScrollInterval);
    }
    return () => {
      clearTimeout(id);
    };
  }, [playing]);

  return <li ref={ref} {...rest} />;
}

type BulletIndicatorProps = {
  active: boolean;
  index: number;
};
export const BulletIndicator = React.forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button'] & BulletIndicatorProps
>(function (props, ref) {
  const { index, active, className, ...rest } = props;
  return (
    <button
      ref={ref}
      data-index={index}
      className={mergeCls(
        'h-2 w-2 rounded-md bg-paper_2 transition-colors',
        active && 'bg-white/60',
        className
      )}
      {...rest}
    />
  );
});

type ScrollBulletIndicator = {
  index: number;
};
export function ScrollBulletIndicator(props: ScrollBulletIndicator) {
  const { index } = props;
  const { entries, scrollToIndex } = useScroll();
  const isActive = entries[index]?.intersectionRatio > 0.5;

  return <BulletIndicator index={index} active={isActive} onClick={scrollToIndex} />;
}

export function useScroll() {
  const { entries, observer, lastVisibleIndex, firstVisibleIndex } = useIntersectionObserver();

  const scrollToNextOffView = (options?: { cycle: boolean }) => {
    const { cycle } = options || { cycle: false };
    if (!observer?.root) {
      return;
    }
    let nextSibling = entries[lastVisibleIndex]?.target.nextElementSibling;
    if (cycle && lastVisibleIndex === entries.length - 1) {
      nextSibling = entries[0]?.target;
    }

    if (!nextSibling) {
      return;
    }
    if ('offsetLeft' in nextSibling) {
      const scrollLeft = nextSibling.offsetLeft as number;
      (observer.root as HTMLUListElement).scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const scrollToPrevOffView = () => {
    if (!observer?.root) {
      return;
    }
    const prevSibling = entries[firstVisibleIndex]?.target.previousElementSibling;
    if (!prevSibling) {
      return;
    }
    if ('offsetLeft' in prevSibling) {
      const scrollLeft = prevSibling.offsetLeft as number;
      (observer.root as HTMLUListElement).scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const scrollToIndex = (payload: React.MouseEvent<HTMLElement> | number) => {
    if (!observer?.root) {
      return;
    }
    const index =
      typeof payload === 'number' ? payload : Number(payload.currentTarget.dataset.index);
    const target = entries[index]?.target;
    if ('offsetLeft' in target) {
      const scrollLeft = target.offsetLeft as number;
      (observer.root as HTMLUListElement).scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return { scrollToNextOffView, scrollToPrevOffView, scrollToIndex, entries, observer };
}
