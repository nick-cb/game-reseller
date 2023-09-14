import {
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type CarouselState<Target extends HTMLElement> = {
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
  onChange?: <Target extends HTMLElement>(
    state: CarouselState<Target>,
    fromUser: boolean
  ) => void;
}) {
  const {
    containerRef,
    itemSelector,
    onChange,
    config,
    enabled = true,
  } = options;
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

  const findNextActive = useCallback(
    (prev: CarouselState<Item>, newIndex: number) => {
      if (newIndex === prev.index) {
        return prev;
      }
      const elementList = containerRef.current?.querySelectorAll(itemSelector);
      const newElelement = elementList?.item(newIndex);
      if (!newElelement) {
        return prev;
      }
      const newActive = {
        index: newIndex,
        target: newElelement as Item,
      };
      return newActive;
    },
    []
  );

  // Flatten callback as much as possible
  const _goToIndex = useCallback(
    (
      prev: CarouselState<Item>,
      newIndex: number,
      fromUser: boolean,
      scroll = true
    ) => {
      const newActive = findNextActive(prev, newIndex);
      if (newActive.index === prev.index) {
        return newActive;
      }
      onChange?.(newActive, fromUser);
      if (scroll) {
        scrollToIndex(newIndex);
      }
      return newActive;
    },
    [options.config, onChange, scrollToIndex, itemSelector, enabled]
  );

  // Don't call this function inside this hook
  // Don't implement logic inside this function, use _goToIndex instead
  const goToIndex = useCallback(
    function (newIndex: number) {
      if (!enabled) {
        return;
      }
      setActive((prev) => {
        return _goToIndex(prev, newIndex, true);
      });
    },
    [_goToIndex]
  );

  const goToNext = useCallback(
    (value?: { loop: boolean }) => {
      const { loop } = value || { loop: true };
      if (!enabled) {
        return;
      }
      setActive((prev) => {
        const elementList =
          containerRef.current?.querySelectorAll(itemSelector);
        const isLastItem = prev.index === (elementList?.length || 0) - 1;
        if (!loop && isLastItem) {
          return prev;
        }
        return _goToIndex(
          prev,
          (prev.index + 1) % (elementList?.length || 0),
          true
        );
      });
    },
    [options.config, onChange]
  );

  // Changing state if user don't use controllers
  // Only change active state this if the `active` state is not correct
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      return;
    }
    const elementList = containerRef.current?.querySelectorAll(itemSelector);
    const elementListArr = Array.from(elementList);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio > 0.5) {
            console.log(entry);
            const newIndex = elementListArr.findIndex((element) =>
              element.isSameNode(entry.target)
            );
            setActive((prev) => {
              return _goToIndex(prev, newIndex, false, false);
            });
          }
        }
      },
      {
        root: container,
        threshold: 0.5,
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
    goToNext,
  };
}

export function useList<ContainerEl extends HTMLElement>(options: {
  containerRef: RefObject<ContainerEl>;
  itemSelector: string;
  config: {
    method: "scroll";
  };
  enabled?: boolean;
  onChange?: <Target extends HTMLElement>(
    state: CarouselState<Target>,
    fromUser: boolean
  ) => void;
}) {}

const scrollContext = createContext({});

function ScrollContext() {
  const ref = useRef<HTMLUListElement>(null);

  return (
    <scrollContext.Provider value={{}}>
      <ul ref={ref}>

      </ul>
    </scrollContext.Provider>
  );
}