import { useContext, useEffect, useState } from "react";
import { isElement, scrollContext } from "@/components/scroll/index";

export function useScroll(factory?: ReturnType<typeof useScrollFactory>) {
  const scrollContextReturn = useContext(scrollContext);
  const { elements, observer } = factory || scrollContextReturn;

  const scrollToNextOffView = (direction: "left" | "right") => {
    const { root, thresholds } = observer || {};
    if (!root || !isElement(root)) {
      return;
    }
    const { left } = root.getBoundingClientRect();
    let nextOffViewIdx: number = -1;
    if (direction === "right") {
      const firstInviewIdx = elements.findIndex(
        (el) => el.intersectionRatio > 0.5,
      );
      nextOffViewIdx = elements
        .slice(firstInviewIdx)
        .findIndex((el) => el.intersectionRatio <= 0.5);
    } else {
      console.log(elements);
      nextOffViewIdx = elements.findIndex(
        (el, index) =>
          el.intersectionRatio <= 0.5 &&
          elements[index + 1]?.intersectionRatio > 0.5,
      );
    }

    console.log(nextOffViewIdx);
    if (nextOffViewIdx === -1) {
      return;
    }
    const { target, boundingClientRect } = elements[nextOffViewIdx];
    root.scrollBy({
      left: boundingClientRect.width,
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
    // const { x, y, width, height, right, bottom } =
    //   entry.target.getBoundingClientRect();
    // const {
    //   x: rootX,
    //   y: rootY,
    //   width: rootW,
    //   height: rootH,
    //   right: rootR,
    //   bottom: rootB,
    // } = root.getBoundingClientRect();

    root.scroll({
      left: entry.boundingClientRect.width * index,
      behavior: "smooth",
    });
    // console.log(entry);
    // entry.target.scrollIntoView({
    //   block: 'nearest',
    //   inline: 'nearest',
    //   behavior: 'smooth',
    // });
  };

  const scrollToPage = (page: number, pageStep: number) => {
    scrollToIndex(page * pageStep);
  };

  return { elements, scrollToNextOffView, scrollToIndex, scrollToPage };
}

export function useScrollFactory({
  containerSelector,
  observerOptions,
  infiniteScroll,
  infiniteScrollOptions,
}: {
  containerSelector: string;
  observerOptions?: IntersectionObserverInit;
  infiniteScroll?: boolean;
  infiniteScrollOptions?: {
    animate: number | KeyframeAnimationOptions | undefined;
  };
}) {
  const [elements, setElements] = useState<IntersectionObserverEntry[]>([]);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    const newObserver = new IntersectionObserver(
      (entries) => {
        console.log({entries});
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
        infiniteScrollOptions?.animate ?? {
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

/*
 * const { observer, scrollToIndex } = useScroll('#container', {
 *  active(elements: Entries[]) {
 *
 *  }
 * });
 *
 * <Scroll containerSelector={'#container'} active={(elements: Entries[])=> {}}>
 *
 * </Scroll>
 *
 * useScroll() {
 *    const observer = new IntersectionObserver(() => {
 *
 *    }, {
 *
 *    })
 *
 *    goToIndex(index: number) {
 *      observer.takeRecords();
 *    }
 * }
 * */

/*
 * What are we worried about? We might need to use observed values and get stalled state
 * Observer callback being run when the pass threshold, it can be run multiple time with different element
 * Call goToIndex(index):1 -> scroll root ->
 * Call goToIndex(index):2
 *  - Before observer callback run
 *  - After observer callback run
 * */
