import {
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type CarouselState<Target extends HTMLElement> = {
  index: number;
  target: Target | null;
};
export function useCarousel<
  ContainerEl extends HTMLElement,
  Item extends HTMLElement
>(options: {
  containerRef: RefObject<ContainerEl>;
  itemSelector: string;
  config:
    | {
        method: "scroll";
      }
    | {
        method: "transform";
      };
  enabled?: boolean;
  onActive?: <Target extends HTMLElement>(state: CarouselState<Target>) => void;
}) {
  const { containerRef, itemSelector, onActive, config, enabled = true } = options;
  const [active, setActive] = useState<CarouselState<Item>>({
    index: 0,
    target: null,
  });

  const scrollToIndex = useCallback(function (index: number) {
    if (!containerRef.current) {
      return;
    }
    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    container.scroll({
      left: index * width,
      behavior: "smooth",
    });
  }, []);

  const transformToIndex = useCallback(function ({
    index,
    width,
  }: {
    index: number;
    width: number;
  }) {
    if (!containerRef.current) {
      return;
    }
    const container = containerRef.current;
    container.style.setProperty("transform", `translateX(-${width * index}px)`);
  },
  []);

  const goToIndex = useCallback(
    function (newIndex: number, scroll = true) {
      if (!enabled) {
        return;
      }
      setActive((prev) => {
        if (newIndex === prev.index) {
          return prev;
        }
        const elementList = containerRef.current?.querySelectorAll(itemSelector)
        const newElelement = elementList?.item(newIndex);
        if (!newElelement) {
          return prev;
        }
        const newActive = {
          index: newIndex,
          target: newElelement as Item,
        };
        onActive?.(newActive);
        if (scroll) {
          scrollToIndex(newIndex);
        }
        return newActive;
      });
    },
    [options.config, onActive, scrollToIndex, itemSelector, enabled]
  );

  // Changing state if user don't use controllers
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      return;
    }
    const elementList = containerRef.current?.querySelectorAll(itemSelector)
    const elementListArr = Array.from(elementList);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio > 0.5) {
            const newIndex = elementListArr.findIndex((element) =>
              element.isSameNode(entry.target)
            );
            goToIndex(newIndex, false);
          }
        }
      },
      {
        root: container,
        threshold: 0.5
      }
    );

    for (const item of elementListArr) {
      observer.observe(item);
    }

    return () => {
      observer.disconnect();
    };
  }, [goToIndex, enabled]);

  return {
    active,
    goToIndex,
  };
}

// next
// prev
// remove current active
// remove prev active
// active next
// register control
// know which item is active
// let's the user decide the style
