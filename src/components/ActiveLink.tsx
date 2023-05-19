"use client";

import { usePathname } from "next/navigation";
import React, { PropsWithChildren, useMemo } from "react";

const ActiveLink = ({
  children,
  match,
  exact = false,
  matches,
}: PropsWithChildren<{
  match?: string;
  exact?: boolean;
  matches?: { name: string; exact?: boolean }[];
}>) => {
  const pathname = usePathname();
  const isMatch = useMemo(() => {
    if (!matches && !match) {
      return false;
    }
    if (matches) {
      if (exact) {
        return matches?.every((match) =>
          match.exact ? match.name === pathname : match.name.includes(pathname)
        );
      }
      return matches?.some((match) =>
        match.exact ? match.name === pathname : match.name.includes(pathname)
      );
    }
    if (exact) {
      return pathname === match;
    }
    return pathname.includes(match || "");
  }, [pathname, match, exact, matches]);
  return (
    <div className={`contents ${isMatch ? "active-link" : ""}`}>{children}</div>
  );
};

export default ActiveLink;
