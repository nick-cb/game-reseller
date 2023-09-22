"use client";

import { useLayoutEffect, useState } from "react";

const createBreakpoints = <
  T extends number[] | Readonly<number[]>,
  R = { [k in `b${T[number]}`]: -1 | 0 | 1 },
>(
  breakpoints: T,
  against?: number,
  previous?: R,
): {
  result: R;
  changed: boolean;
} => {
  const result = {} as R;
  if (typeof window === "undefined") {
    for (const breakpoint of breakpoints) {
      result[`b${breakpoint}` as keyof R] = 0 as R[keyof R];
    }
    return { result, changed: true };
  }
  const innerAgainst = against || window.innerWidth;
  let flag = false;
  for (const breakpoint of breakpoints) {
    const current =
      breakpoint === innerAgainst ? 0 : breakpoint > innerAgainst ? -1 : 1;
    if (previous && !flag) {
      if (previous[`b${breakpoint}` as keyof R] !== current) {
        flag = true;
      }
    }
    result[`b${breakpoint}` as keyof R] = current as R[keyof R];
  }

  return { result, changed: previous ? flag : true };
};

/**
 * Check if the window size is less than or greater than given breakpoints
 * - `-1`: **Less** than the breakpoint
 * - `0`: **Equal** to the breakpoint
 * - `1`: **Greater** than the breakpoint
 * */
export const useBreakpoints = <T extends number>(
  breakpoints: T[] | readonly T[],
  against?: number,
) => {
  const [result, setResult] = useState<{ [K in `b${T}`]: -1 | 0 | 1 }>(
     createBreakpoints(breakpoints, against).result,
  );

  useLayoutEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("resize", () => {
        setResult((prev) => {
          const { result, changed } = createBreakpoints(
            breakpoints,
            against,
            prev,
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
