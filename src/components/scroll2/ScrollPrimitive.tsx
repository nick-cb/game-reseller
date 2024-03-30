'use client';

import React, { useEffect, useMemo, useRef } from 'react';
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
  const { observer, entries } = useIntersectionObserver();
  const nextIndex = useMemo(() => {
    if (!autoScrollInterval) {
      return -1;
    }
    const index = entries.findIndex((entry) => entry.target === ref.current);
    const nextIndex = (index + 1) % entries.length;
    if (index === nextIndex) {
      return nextIndex;
    }
    return -1;
  }, [entries, autoScrollInterval]);

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }
  }, [observer]);

  useEffect(() => {
    if (!autoScrollInterval) {
      return;
    }
    const nextTarget = entries[nextIndex]?.target;
    const id = setTimeout(() => {
      nextTarget?.scrollIntoView({
        behavior: 'smooth',
      });
    }, autoScrollInterval);

    return () => {
      clearTimeout(id);
    };
  }, [autoScrollInterval, nextIndex]);

  return <li ref={ref} {...rest} />;
}

export function VideoScrollItem(props: ScrollItemProps) {
  const { autoScrollInterval, ...rest } = props;
  const { playing, currentTime, duration } = useVideo({
    events: ['loadedmetadata', 'play', 'pause'],
  });
  const { entries } = useIntersectionObserver();
  const ref = useRef<HTMLLIElement>(null);
  const nextIndex = useMemo(() => {
    if (!autoScrollInterval) {
      return -1;
    }
    const index = entries.findIndex((entry) => entry.target === ref.current);
    return (index + 1) % entries.length;
  }, [entries, autoScrollInterval]);

  useEffect(() => {
    const nextTarget = entries[nextIndex]?.target;
    let id: NodeJS.Timeout | undefined;
    if (!playing && currentTime > 0 && currentTime === duration) {
      id = setTimeout(() => {
        nextTarget?.scrollIntoView({
          behavior: 'smooth',
        });
      }, autoScrollInterval);
    }

    return () => {
      clearTimeout(id);
    };
  }, [playing, nextIndex]);

  return <li ref={ref} {...rest} />;
}

type BulletIndicatorProps = {
  active: boolean;
};
export const BulletIndicator = React.forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button'] & BulletIndicatorProps
>(function (props, ref) {
  const { active, className, ...rest } = props;
  return (
    <button
      ref={ref}
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
  const { entries } = useIntersectionObserver();
  const isActive = entries[index]?.intersectionRatio > 0.5;

  return (
    <BulletIndicator
      active={isActive}
      onClick={() => {
        entries[index]?.target.scrollIntoView({
          behavior: 'smooth',
        });
      }}
    />
  );
}
