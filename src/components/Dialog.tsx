"use client";

import React, { DetailedHTMLProps, DialogHTMLAttributes } from "react";

export const Dialog = React.forwardRef<
  HTMLDialogElement,
  DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>
>(function ({ className, children, ...props }, ref) {
  return (
    <dialog
      ref={ref}
      className={
        "bg-paper_2 rounded-lg shadow-lg shadow-black text-white_primary p-0 overflow-x-hidden overflow-y-scroll scrollbar-hidden " +
        "opacity-0 inset-0 m-auto fixed " +
        "backdrop:backdrop-blur-xl backdrop-brightness-50 " +
        "animate-[300ms_slide-in-down,_400ms_fade-in] [animation-fill-mode:_forwards] " +
        "[animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)] " +
        className
      }
      {...props}
    >
      {children}
    </dialog>
  );
});
