"use client";

import { useScroll } from "../Scroll";

export default function RequirementButton({
  index,
  system,
}: {
  index: number;
  system: any;
}) {
  const { elements, scrollToIndex } = useScroll();
  const activeIndex = elements.findIndex((el) => el.isIntersecting);

  return (
    <button
      className={
        "rounded-t border-b-[3px] py-7 px-2 text-sm font-bold uppercase " +
        " transition-colors " +
        (activeIndex === index
          ? " border-b-white "
          : " border-b-paper  hover:border-b-white/60 ")
      }
      onClick={() => {
        scrollToIndex(index);
      }}
    >
      <label className="whitespace-nowrap">{system.os}</label>
    </button>
  );
}
