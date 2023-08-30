"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function ExpandableDescription({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    let childrenHeight = 0;
    for (const child of container.children) {
      childrenHeight += child.clientHeight;
    }
    if (!show && childrenHeight > container.clientHeight) {
      setShow(true);
    }
  });

  return (
    <div
      className={
        (!expanded ? "h-144 overflow-hidden " : "h-max ") +
        "relative " +
        className
      }
      ref={ref}
    >
      {children}
      {show ? (
        <div
          className={
            (!expanded ? "bottom-0 absolute " : "") + " w-full"
          }
        >
          {!expanded ? (
            <div className="w-full h-40 bg-gradient-to-t from-default"></div>
          ) : null}
          <button
            className="bg-paper py-4 w-full rounded text-sm relative 
            after:bg-white/25 after:absolute after:inset-0 after:opacity-0 after:rounded after:transition-opacity hover:after:opacity-100 "
            onClick={() => {
              setExpanded((prev) => !prev);
            }}
          >
            {!expanded ? "Show more" : "Show less"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
