"use client";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
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
  infiniteScroll = false,
  observerOptions,
}: PropsWithChildren<{
  containerSelector: string;
  infiniteScroll?: boolean;
  observerOptions?: IntersectionObserverInit | undefined;
}>) {
  const { elements, observer } = useScrollFactory({
    containerSelector,
    infiniteScroll,
    observerOptions,
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
    const { target } = nextOffsetEntry;
    root.scroll({
      // @ts-ignore
      left: target.offsetLeft,
      behavior: "smooth",
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
  infiniteScroll,
}: {
  containerSelector: string;
  observerOptions?: IntersectionObserverInit;
  infiniteScroll?: boolean;
}) {
  const [elements, setElements] = useState<IntersectionObserverEntry[]>([]);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    const newObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setElements((prev) => {
            const index = prev.findIndex((el) =>
              entry.target.isSameNode(el.target),
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
        root,
        threshold: 0.5,
        ...observerOptions,
      },
    );
    setObserver(newObserver);

    return () => {
      newObserver?.disconnect();
    };
  }, [containerSelector]);

  useEffect(() => {
    if (!elements[0] || !observer || !infiniteScroll) {
      return;
    }
    const { root: _root } = observer;
    if (!_root) {
      return;
    }
    const root = _root as Element;
    const isOverflow = !elements.at(-1)?.isIntersecting;
    if (!isOverflow) {
      return;
    }
    const alreadyDuplicateFirstEl =
      elements.length > 1 &&
      elements[0].target.isEqualNode(root.children.item(elements.length));
    if (!alreadyDuplicateFirstEl) {
      root.appendChild(elements[0].target.cloneNode(true));
    }
    let animationFrame = 0;
    let animation: Animation | null = null;
    const animate = () => {
      const { left: firstElLeft } = elements[0].target.getBoundingClientRect();
      const { left: lastElLeft = 0 } =
        root.children.item(elements.length)?.getBoundingClientRect() || {};
      const distance = lastElLeft - firstElLeft;
      if (distance < 0) {
        return;
      }
      animation = root.animate(
        [
          {
            transform: `translateX(-${distance}px)`,
          },
        ],
        {
          duration: 10000,
          easing: "linear",
          fill: "forwards",
        },
      );
      animation.finished.then(() => {
        animationFrame = requestAnimationFrame(() => {
          animation?.cancel();
          const isOverflow = !elements.at(-1)?.isIntersecting;
          if (!isOverflow) {
            root.removeChild(root.children.item(elements.length)!);
            return;
          }
          animate();
        });
      });
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [elements, observer, infiniteScroll]);

  return { elements, observer, observerOptions };
}
