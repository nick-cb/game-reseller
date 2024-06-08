'use client';

import React, { MouseEvent, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { useIntersectionObserver } from '../intersection/IntersectionObserver';
import { useVideo } from '../media/Video';
import { useAudio } from '../media/Audio';

export const ScrollContainer = React.forwardRef<HTMLUListElement, JSX.IntrinsicElements['ul']>(
  function (props, ref) {
    return <ul ref={ref} {...props} />;
  }
);

type ScrollItemProps = JSX.IntrinsicElements['li'] & {
  index: number;
  autoScrollInterval?: number;
};
export function ScrollItem(props: ScrollItemProps) {
  const { index, autoScrollInterval, ...rest } = props;
  const ref = useRef<HTMLLIElement>(null);
  const { entries, observer, scrollToNextOffView } = useScroll();
  const isActive = entries[index]?.isIntersecting;

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }
  }, [observer]);

  useEffect(() => {
    if (!isActive || !autoScrollInterval) {
      return;
    }
    const id = setTimeout(() => {
      scrollToNextOffView({ cycle: true });
    }, autoScrollInterval);
    return () => {
      clearTimeout(id);
    };
  }, [isActive, autoScrollInterval, scrollToNextOffView]);

  return <li ref={ref} {...rest} />;
}
export function VideoScrollItem(props: ScrollItemProps) {
  const { index, autoScrollInterval, ...rest } = props;
  const { video, playing, currentTime, duration, autoPlay } = useVideo({
    events: ['loadedmetadata', 'play', 'pause'],
  });
  const { audio } = useAudio({ events: ['loadedmetadata'] });
  const { entries, observer, scrollToNextOffView } = useScroll();
  const isActive = entries[index]?.isIntersecting;
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }
  }, [observer]);

  useEffect(() => {
    if (!isActive || !autoScrollInterval) {
      return;
    }
    let id: NodeJS.Timeout | undefined;
    const isEndOfVideo = currentTime > 0 && currentTime === duration;
    if (autoPlay && !playing && isEndOfVideo) {
      id = setTimeout(() => {
        scrollToNextOffView({ cycle: true });
      }, autoScrollInterval);
    }
    if (!autoPlay) {
      id = setTimeout(() => {
        scrollToNextOffView({ cycle: true });
      }, autoScrollInterval);
    }
    return () => {
      clearTimeout(id);
    };
  }, [playing, autoScrollInterval, isActive]);

  useEffect(() => {
    if (!isActive) {
      video?.pause();
      audio?.pause();
    }
  }, [isActive]);

  return <li ref={ref} {...rest} />;
}

type ScrollToNextOffViewOptions = { cycle: boolean } | MouseEvent;
const isOption = (value: any): value is { cycle: boolean } => {
  return 'cycle' in value;
};
export function useScroll() {
  const { entries, observer, lastVisibleIndex, firstVisibleIndex } = useIntersectionObserver();

  const scrollToNextOffView = (options?: ScrollToNextOffViewOptions) => {
    let cycle = false;
    if (isOption(options)) {
      cycle = options?.cycle;
    } else {
      // @ts-ignore
      cycle = options?.currentTarget.dataset.cycle === 'true';
    }

    if (!observer?.root) {
      return;
    }
    let nextSibling =
      entries[lastVisibleIndex]?.target.nextElementSibling ?? observer.root.firstChild;
    if (!cycle && lastVisibleIndex === entries.length - 1) {
      nextSibling = null;
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
    const target = entries[index]?.target || {};
    if ('offsetLeft' in target) {
      const scrollLeft = target.offsetLeft as number;
      (observer.root as HTMLUListElement).scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return {
    scrollToNextOffView,
    scrollToPrevOffView,
    scrollToIndex,
    entries,
    observer,
    firstVisibleIndex,
    lastVisibleIndex,
  };
}

export function useScrollState() {
  const { observer } = useIntersectionObserver();
  const stateRef = useRef({ isScrolling: false });
  useSyncExternalStore(
    useCallback(() => {
      const handler = () => {
        stateRef.current = { isScrolling: true };
      };
      observer?.root?.addEventListener('scroll', handler);
      return () => {
        observer?.root?.removeEventListener('scroll', handler);
      };
    }, []),
    () => stateRef.current,
    () => stateRef.current
  );

  return stateRef.current;
}
