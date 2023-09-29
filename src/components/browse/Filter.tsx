"use client";

import {
  useClickOutside,
  useClickOutsideCallback,
} from "@/hooks/useClickOutside";
import { useRef } from "react";

export default function Filter() {
  const ref = useRef<HTMLDialogElement>(null);

  const contentContainerRef = useClickOutsideCallback<HTMLDivElement>(() => {
    ref.current?.close();
  });

  return (
    <>
      <button
        onClick={() => {
          ref.current?.showModal();
        }}
        className="h-8 w-8 rounded focus:outline"
            draggable
            onDrag={(event) => {
              console.log(event);
            }}
            onDragStart={() => {
              console.log("drag start");
            }}
      >
        <svg width={24} height={24} stroke="white" className="m-auto">
          <use
            width={24}
            height={24}
            xlinkHref="/svg/sprites/actions.svg#filter"
          />
        </svg>
      </button>
      <dialog
        ref={ref}
        className={
          "bg-paper_2 rounded-t-3xl shadow-lg shadow-black text-white_primary p-0 overflow-hidden " +
          "opacity-0 fixed w-full mx-0 max-w-full bottom-0 top-[unset] h-96 " +
          // "backdrop:backdrop-blur-xl backdrop-brightness-50 " +
          "animate-[300ms_slide-in-up,_400ms_fade-in] [animation-fill-mode:_forwards] " +
          "[animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)] "
        }
      >
        <div ref={contentContainerRef} className="mt-auto w-full h-full">
          <p
            draggable
            onDrag={(event) => {
              console.log(event);
            }}
            onDragStart={() => {
              console.log("drag start");
            }}
          >
            Hello
          </p>
        </div>
      </dialog>
    </>
  );
}
