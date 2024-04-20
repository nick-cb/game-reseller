'use client';

import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { useBreakpoints } from '@/hooks/useBreakpoint';
import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  PropsWithChildren,
  useContext,
  DetailedHTMLProps,
  LiHTMLAttributes,
  HTMLAttributes,
} from 'react';

type ContextProps = {
  index: number;
  indicatorListRef: React.MutableRefObject<HTMLUListElement | null>;
  changeIndex: (index: number) => void;
};
const carouselCtx = createContext({} as ContextProps);

const breakpoints = [640] as const;
export function HCarousel({
  length,
  children,
  Indicator,
}: PropsWithChildren<{ length: number; Indicator: React.ReactNode }>) {
  const { b640: sm } = useBreakpoints(breakpoints);
  const [index, setIndex] = useState(-1);
  let prev = useRef(0);
  const mainListRef = useRef<HTMLUListElement>(null);
  const previewListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (sm < 0) {
      return;
    }
    const mainList = mainListRef.current;
    const previewList = previewListRef.current;
    if (!mainList || !previewList) {
      return;
    }
    mainList.classList.add('stack-fade-carousel');
    for (const item of previewList.children) {
      item.classList.add('pointer-none');
    }
  }, []);

  useEffect(() => {
    const mainList = mainListRef.current;
    const previewList = previewListRef.current;
    if (!mainList || !previewList) {
      return;
    }
    if (sm < 0) {
      for (const item of mainList.children) {
        item.getAnimations().forEach((animation) => animation.cancel());
        item.classList.remove('not-active');
        item.classList.remove('active');
      }
      return;
    }
    if (index !== -1) {
      mainList?.children.item(prev.current)?.classList.add('not-active');
      mainList?.children.item(prev.current)?.classList.remove('active');
      mainList?.children.item(index)?.classList.add('active');
      mainList?.children.item(index)?.classList.remove('not-active');
    }

    previewList.children.item(prev.current)?.classList.remove('active');
    previewList.children.item(index === -1 ? 0 : index)?.classList.add('active');
    prev.current = index === -1 ? 0 : index;

    // const id = setTimeout(() => {
    //   requestAnimationFrame(() => {
    //     setIndex((prev) => (index === -1 ? 1 : (prev + 1) % length));
    //   });
    // }, 10000);
    return () => {
      // clearTimeout(id);
    };
  }, [index, sm]);

  const changeIndex = (index: number) => {
    setIndex(index);
  };

  return (
    <carouselCtx.Provider value={{ index, changeIndex, indicatorListRef: previewListRef }}>
      <IntersectionObserverContainer>
        <IntersectionObserverRoot>
          <ul
            className={
              'main-list gap-4 sm:gap-0 ' +
              'lg:aspect-media scrollbar-hidden relative aspect-[9/11] snap-x snap-mandatory overflow-scroll rounded-lg sm:aspect-[1.6] sm:w-[75%] lg:w-4/5'
            }
            ref={mainListRef}
          >
            {children}
          </ul>
        </IntersectionObserverRoot>
        {Indicator}
      </IntersectionObserverContainer>
    </carouselCtx.Provider>
  );
}

export function IndicatorList({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) {
  const { indicatorListRef } = useContext(carouselCtx);

  return <ul ref={indicatorListRef} {...props} />;
}

export function Indicator({
  index,
  onClick,
  ...props
}: { index: number } & DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>) {
  const { changeIndex } = useContext(carouselCtx);

  return <li {...props} onClick={() => changeIndex(index)}></li>;
}
