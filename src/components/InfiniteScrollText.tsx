"use client";

import {
  DetailedHTMLProps,
  HTMLAttributes,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export function InfiniteScrollText({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const container = ref.current;
    const children = container.children;
    let childrenTotalWidth = 0;
    for (const child of children) {
      const { width: childWidth } = child.getBoundingClientRect();
      childrenTotalWidth += childWidth;
    }
    const { width: containerWidth } = container.getBoundingClientRect();
    const firstEl = container.children.item(0);
    if (!firstEl) {
      return;
    }
    const childrenLength = container.children.length;
    const alreadyAppendFirst =
      container.children.length > 1
        ? firstEl.isEqualNode(container.children.item(childrenLength - 1))
        : false;
    if (childrenTotalWidth > containerWidth && !alreadyAppendFirst) {
      container.appendChild(firstEl.cloneNode(true));
    }
    let animationFrame = 0;
    // console.log({ childrenTotalWidth, containerWidth });
    if (childrenTotalWidth > containerWidth) {
      const animate = () => {
        const animation = container.animate(
          [
            {
              transform: `translateX(-${
                childrenTotalWidth + 40 * childrenLength
              }px)`,
            },
          ],
          {
            duration: 10000,
            easing: "linear",
          }
        );
        animation.finished.then(() => {
          animationFrame = requestAnimationFrame(() => {
            animate();
          });
        });
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  );
}

export function useInfiniteScrollText<T extends HTMLElement>({
  containerRef,
  scrollRef,
}: {
  containerRef: RefObject<T> | null;
  scrollRef: RefObject<T> | null;
}) {
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    const scrollElement = scrollRef?.current;
    if (!container || !scrollElement) {
      return;
    }
    const children = container.children;
    const firstEl = children.item(0);
    if (!firstEl) {
      return;
    }
    const { width: firstElWidth } = firstEl.getBoundingClientRect();
    let animationFrame = 0;
    let animation: Animation | null = null;
    const observer = new ResizeObserver((entries) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (animation?.playState === "running") {
        return;
      }
      const entry = entries[0];
      const { width: containerWidth } = entry.contentRect;
      // console.log({containerWidth});
      setIsOverflow(firstElWidth >= containerWidth);
      if (firstElWidth <= containerWidth) {
        return;
      }
      const alreadyAppendFirst =
        container.children.length > 1
          ? firstEl.isEqualNode(container.children.item(1))
          : false;
      if (!alreadyAppendFirst) {
        container.appendChild(firstEl.cloneNode(true));
      }
      const animate = () => {
        animation = scrollElement.animate(
          [
            {
              transform: `translateX(-${firstElWidth + 40}px)`,
            },
          ],
          {
            duration: 10000,
            easing: "linear",
            fill: "forwards",
          }
        );
        animation.finished.then(() => {
          animationFrame = requestAnimationFrame(() => {
            animation?.cancel();
            const { width: containerWidth } =
              entry.target.getBoundingClientRect();
            if (firstElWidth <= containerWidth) {
              container.removeChild(container.children.item(1)!);
              return;
            }
            animate();
          });
        });
      };
      animationFrame = requestAnimationFrame(animate);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      animation?.cancel();
    };
  }, []);

  return { isOverflow };
}
