"use client";

import { useState } from "react";
import StripeLogo from "@/components/StripeLogo";
import { AnimatedSizeItem, AnimatedSizeProvider } from "./AnimatedSizeProvider";

export default function Accordion() {
  const [active, setActive] = useState(0);

  return <div></div>;
}

export function AccordionItem() {
  const [hideContent, setHideContent] = useState(true);

  return (
    <div className="bg-paper_2">
      <h3
        className="text-lg relative
        after:bg-white/[0.10] after:absolute after:inset-0 
        after:opacity-0 hover:after:opacity-100 after:transition-opacity
        after:pointer-events-none"
        data-component={"collapsibles"}
        aria-expanded={false}
      >
        <button
          className="flex justify-between items-center w-full py-4 px-6 "
          onClick={() => {
            setHideContent((prev) => !prev);
          }}
        >
          <div className="flex gap-4 items-center">
            <StripeLogo className="bg-[#635bff] w-14 px-1 py-[2px] rounded" />
            <span>Stripe</span>
          </div>
          <svg
            className="transition-transform"
            fill="transparent"
            stroke="white"
            width={24}
            height={24}
            style={{
              transform: hideContent ? "rotateZ(0deg)" : "rotateZ(180deg)",
            }}
          >
            <use xlinkHref="/svg/sprites/actions.svg#chevron-down" />
          </svg>
        </button>
      </h3>
      <AnimatedSizeProvider className={"h-0 "} as={"div"}>
        <AnimatedSizeItem
          active={!hideContent}
          aria-hidden={hideContent}
          hidden={hideContent}
          updateOnInactive={true}
        >
          Stripe content Stripe content Stripe content Stripe content Stripe
          content Stripe content Stripe content
        </AnimatedSizeItem>
      </AnimatedSizeProvider>
    </div>
  );
}
