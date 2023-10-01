"use client";

import { useScroll } from "../Scroll";
import StandardButton from "../StandardButton";
import { AnimatedIcon } from "../icons/animated";

export function PlaceOrderButton() {
  const { elements } = useScroll();
  const method = elements.findIndex((el) => el.isIntersecting);

  return (
    <StandardButton
      disabled={false}
      className={
        "h-14 relative " +
        "before:absolute before:inset-0 before:bg-[rgb(255,_196,_57)] " +
        " before:rounded hover:!brightness-90 before:transition-[width] " +
        " before:w-0 " +
        (method === 1 ? " before:w-full " : "") +
        " before:duration-200 "
      }
    >
      <AnimatedIcon.Paypal show={method === 1} />
      <span
        className={
          "relative transition-colors delay-[25ms] duration-[175ms] " +
          (method === 1 ? " text-default " : "")
        }
      >
        Place order
      </span>
    </StandardButton>
  );
}
