"use client";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const scrollContext = createContext<{
  elements: IntersectionObserverEntry[];
  observer: IntersectionObserver | null;
}>({
  elements: [],
  observer: null,
});
export default function Scroll({
  children,
  containerSelector,
}: PropsWithChildren<{ containerSelector: string }>) {
  const { elements, observer } = useScrollFactory({
    containerSelector,
  });

  return (
    <scrollContext.Provider value={{ elements, observer }}>
      {children}
    </scrollContext.Provider>
  );
}

function isElement(element: Element | Document): element is Element {
  return true;
}

export function useScroll(factory?: ReturnType<typeof useScrollFactory>) {
  const scrollContextReturn = useContext(scrollContext);
  const { elements, observer } = factory || scrollContextReturn;

  const scrollToNextOffView = (direction: "left" | "right") => {
    const { root, thresholds } = observer || {};
    if (!root || !isElement(root)) {
      return;
    }
    const { left } = root.getBoundingClientRect();
    let nextOffsetEntry: IntersectionObserverEntry | undefined;
    if (direction === "right") {
      nextOffsetEntry = elements.find((el) => {
        return (
          el.boundingClientRect.left > left &&
          thresholds?.some((s) => el.intersectionRatio < s)
        );
      });
    } else {
      nextOffsetEntry = elements.findLast((el) => {
        return (
          el.boundingClientRect.left < left &&
          thresholds?.some((s) => el.intersectionRatio < s)
        );
      });
    }

    if (!nextOffsetEntry) {
      return;
    }
    const {
      target,
    } = nextOffsetEntry;
    console.log({ target });
    root.scroll({
      left: target.offsetLeft,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    const root = observer?.root;
    if (!root || !isElement(root)) {
      return;
    }

    const entry = elements[index];
    if (!entry) {
      return;
    }
    entry.target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  return { elements, scrollToNextOffView, scrollToIndex };
}

export function Item<C extends keyof JSX.IntrinsicElements>({
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
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

export function useScrollFactory({
  containerSelector,
  observerOptions,
}: {
  containerSelector: string;
  observerOptions?: IntersectionObserverInit;
}) {
  const [elements, setElements] = useState<IntersectionObserverEntry[]>([]);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  console.log({observer});

  useEffect(() => {
    const newObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setElements((prev) => {
            const index = prev.findIndex((el) =>
              entry.target.isSameNode(el.target)
            );
            if (index > -1) {
              prev[index] = entry;
              return [...prev];
            }
            return [...prev, entry];
          });
        }
      },
      {
        root: document.querySelector(containerSelector),
        threshold: 0.5,
        ...observerOptions,
      }
    );
    setObserver(newObserver);

    return () => {
      newObserver?.disconnect();
    };
  }, [containerSelector]);

  return { elements, observer, observerOptions };
}
