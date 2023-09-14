"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

export function HideOnRoute({
  children,
  match,
  matches,
  exact,
}: PropsWithChildren<{
  match?: string;
  exact?: boolean;
  matches?: { name: string; exact?: boolean }[];
}>) {
  const pathname = usePathname();
  const isMatch = useMemo(() => {
    if (!matches && !match) {
      return false;
    }
    if (matches) {
      if (exact) {
        return matches?.every((match) =>
          match.exact ? match.name === pathname : pathname.includes(match.name)
        );
      }
      return matches?.some((match) =>
        match.exact ? match.name === pathname : pathname.includes(match.name)
      );
    }
    if (exact) {
      return pathname === match;
    }
    return pathname.includes(match || "");
  }, [pathname, match, exact, matches]);

  if (isMatch) {
    return null;
  }

  return <>{children}</>;
}
