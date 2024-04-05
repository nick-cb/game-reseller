'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver } from '../intersection/IntersectionObserver';

type ScrollTextProps = JSX.IntrinsicElements['p'];
export function ScrollText(props: ScrollTextProps) {
  const { children, ...rest } = props;
  const { observer, entries } = useIntersectionObserver();
  const ref = useRef<HTMLParagraphElement>(null);
  const isFit = entries[0]?.intersectionRatio >= 1;
  const abortController = useMemo(() => {
    if (isFit) {
      return null;
    }
    return new AbortController();
  }, [isFit]);

  useEffect(() => {
    if (!ref.current) return;
    observer?.observe(ref.current);
    return () => {
      if (!ref.current) return;
      observer?.unobserve(ref.current);
    };
  }, [observer]);

  useEffect(() => {
    if (isFit || !observer || !entries[0]) {
      return;
    }
    const { root } = observer;
    if (!entries[0].target?.nextSibling) {
      root?.appendChild(entries[0]?.target?.cloneNode(true));
    }
    let animationFrame = 0;
    async function animate() {
      if (root instanceof Document) {
        return 0;
      }
      const entry = entries[0];
      if (!entry || !root) {
        return 0;
      }
      const element = entry.target as HTMLElement;
      const { left: firstElLeft } = element.getBoundingClientRect();
      const nextSibling = element.nextSibling;
      let lasElLeft = 0;
      if (nextSibling && nextSibling instanceof HTMLElement) {
        lasElLeft = nextSibling?.getBoundingClientRect().left;
      }

      const distance = lasElLeft - firstElLeft;
      if (distance < 0) {
        return 0;
      }

      const animation = root.animate([{ transform: `translateX(-${distance}px)` }], {
        duration: 10000,
        easing: 'linear',
        fill: 'forwards',
      });
      await animation.finished;
      animation?.cancel();
      if (abortController?.signal.aborted) {
        if (nextSibling) {
          root.removeChild(nextSibling);
        }
        return 0;
      }

      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animationFrame);
      abortController?.abort();
    };
  }, [isFit, entries, observer?.root]);

  return (
    <p ref={ref} {...rest}>
      {children}
    </p>
  );
}
