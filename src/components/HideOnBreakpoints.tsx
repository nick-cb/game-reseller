"use client";

import { useBreakpoints } from '@/hooks/useBreakpoint';

type HideOnBreakpoints = {
  from: number[] | readonly number[];
};
export function ShowOnBreakpoints(props: React.PropsWithChildren<HideOnBreakpoints>) {
  const { children, from } = props;
  const breakpoints = useBreakpoints(from);

  if (Object.values(breakpoints).some((breakpoint) => breakpoint < 0)) {
    return null;
  }

  return children;
}
