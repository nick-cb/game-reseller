"use client";

import { useMemo } from "react";
import { useScroll } from "../scroll/hook";

export function CarouselButton() {
  const { elements, scrollToIndex } = useScroll();
  const { firstItemInView } = useMemo(() => {
    const firstItemInViewIdx = elements.findIndex(
      (el) => el.intersectionRatio > 0.5,
    );
    return {
      firstItemInView: {
        index: firstItemInViewIdx,
        element: elements[firstItemInViewIdx],
      },
    };
  }, [elements]);

  return (
    <>
      <button
        onClick={() => {
          if (firstItemInView) {
            scrollToIndex(firstItemInView.index - 1);
          }
        }}
        className={
          "bg-paper_2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-color "
        }
      >
        <svg
          fill={"transparent"}
          stroke={
            elements[0]?.isIntersecting
              ? "rgb(255 255 255 / 0.25)"
              : "rgb(255 255 255)"
          }
          className="-rotate-90 w-[32px] h-[32px]"
        >
          <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
        </svg>
      </button>
      <button
        onClick={() => {
          if (firstItemInView) {
            scrollToIndex(firstItemInView.index + 1);
          }
        }}
        className="bg-paper_2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-color"
      >
        <svg
          fill={"transparent"}
          stroke={
            elements.at(-1)?.isIntersecting
              ? "rgb(255 255 255 / 0.25)"
              : "rgb(255 255 255)"
          }
          className="rotate-90 w-[32px] h-[32px]"
        >
          <use xlinkHref="/svg/sprites/actions.svg#slide-up" />
        </svg>
      </button>
    </>
  );
}
