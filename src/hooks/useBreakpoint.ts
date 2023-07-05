"use client";

import { useLayoutEffect, useState } from "react";

const createBreakpoints = <T extends number>(
  breakpoints: T[],
  against?: number,
  previous?: { [k in `b${T}`]: -1 | 0 | 1 }
) => {
  if (typeof window === "undefined") {
    return { result: {} as any, changed: false };
  }
  const innerAgainst = against || window.innerWidth;
  let flag = false;
  if (previous && breakpoints.length !== Object.keys(previous).length) {
    flag = true;
  }
  const result: { [k in `b${T}`]: -1 | 0 | 1 } = breakpoints.reduce(
    (prev, breakpoint) => {
      const current =
        breakpoint === innerAgainst ? 0 : breakpoint > innerAgainst ? -1 : 1;
      if (previous && !flag) {
        if (previous[`b${breakpoint}`] !== current) {
          flag = true;
        }
      }
      return {
        ...prev,
        [`b${breakpoint}`]: current,
      };
    },
    {} as any
  );

  return { result, changed: previous ? flag : true };
};

/**
 * Check if the window size is less than or greater than given breakpoints
 * - `-1`: **Less** than the breakpoint
 * - `0`: **Equal** to the breakpoint
 * - `1`: **Greater** than the breakpoint
 * */
export const useBreakpoints = <T extends number>(
  breakpoints: T[],
  against?: number
) => {
  const [result, setResult] = useState<{ [K in `b${T}`]: -1 | 0 | 1 }>(
    createBreakpoints(breakpoints, against).result
  );

  useLayoutEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("resize", () => {
        setResult((prev) => {
          const { result, changed } = createBreakpoints(
            breakpoints,
            against,
            prev
          );
          if (changed) {
            return result;
          }
          return prev;
        });
      });
    }
  }, [breakpoints, against]);

  return result;
};
