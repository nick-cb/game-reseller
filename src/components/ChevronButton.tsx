"use client";

import React from "react";

const ChevronButton = React.memo(
  React.forwardRef<
    HTMLButtonElement,
    {
      direction?: "left" | "right";
      className?: string;
      onClick: React.MouseEventHandler<HTMLButtonElement>;
    }
  >(({ direction = "right", className = "", onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className={
          "w-8 h-8 rounded-full bg-white/40 " +
          "flex justify-center items-center " +
          `absolute ${
            direction === "right" ? "right-0" : "left-0"
          } ${className}`
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="14px"
          height="14px"
          className={
            "group-hover:translate-x-2 transition-transform mt-[2px] " +
            (direction === "left" ? "rotate-180" : "")
          }
        >
          <g id="Icon">
            <path
              fill="white"
              d="M5.53,14.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
            />
          </g>
        </svg>
      </button>
    );
  }),
);

export default ChevronButton;
