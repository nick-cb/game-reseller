"use client";

import React, {createContext, PropsWithChildren, useContext, useEffect, useRef,} from "react";

import {useScroll, useScrollFactory} from "@/components/scroll/hook";

export const scrollContext = createContext<{
  elements: IntersectionObserverEntry[];
  observer: IntersectionObserver | null;
}>({
  elements: [],
  observer: null,
});
export function Scroll({
  children,
  containerSelector,
  observerOptions,
  infiniteScroll = false,
  infiniteScrollOptions,
}: PropsWithChildren<{
  containerSelector: string;
  infiniteScroll?: boolean;
  observerOptions?: IntersectionObserverInit | undefined;
  infiniteScrollOptions?: {
    animate: number | KeyframeAnimationOptions | undefined;
  };
}>) {
  const { elements, observer } = useScrollFactory({
    containerSelector,
    infiniteScroll,
    observerOptions,
    infiniteScrollOptions,
  });

  return (
    <scrollContext.Provider value={{ elements, observer }}>
      {children}
    </scrollContext.Provider>
  );
}

export function isElement(element: Element | Document): element is Element {
  return true;
}

export function ScrollItem<C extends keyof JSX.IntrinsicElements>({
  as,
  children,
  factory,
  ...props
}: PropsWithChildren<
  {
    as: C;
    factory?: ReturnType<typeof useScrollFactory>;
  } & JSX.IntrinsicElements[C]
>) {
  const Component = typeof as === "string" ? `${as}` : as;
  const scrollContextReturn = useContext(scrollContext);
  const { observer } = factory || scrollContextReturn;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer?.unobserve(ref.current);
      }
    };
  }, [observer]);

  return (
    // @ts-ignore
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

export function ScrollButton({
  children,
  method,
  index,
  direction,
  ...props
}: {
  method: "scrollToIndex" | "scrollToNextOffView";
  direction?: "left" | "right";
  index?: number;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const { scrollToIndex, scrollToNextOffView } = useScroll();

  return (
    <button
      onClick={() => {
        if (method === "scrollToIndex" && index !== undefined) {
          scrollToIndex(index);
        }
        if (method === "scrollToNextOffView" && direction) {
          scrollToNextOffView(direction);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function BulletIndicator({
  active,
  onClick,
}: {
  active: boolean;
  onClick?: () => void;
  groupClassname?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "bg-paper_2 w-2 h-2 rounded-md transition-colors " +
        (active ? " bg-white/60 " : "")
      }
    ></button>
  );
}

export function ScrollBulletIndicator({index}: { index: number }) {
  const {elements, scrollToIndex} = useScroll();
  const active = elements[index]?.isIntersecting;

  return (
      <BulletIndicator
          active={active}
          onClick={() => {
            scrollToIndex(index);
          }}
      />
  );
}