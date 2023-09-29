"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

export function HideOnRoute({
  children,
  matches,
  exact,
}: PropsWithChildren<{
  exact?: boolean;
  matches: {
    pathname: string;
    has?: [
      {
        type: "query";
        key: string;
        value: string;
      },
    ];
  }[];
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMatch = useMemo(() => {
    if (!matches) {
      return false;
    }
    if (exact) {
      return matches?.every((match) => {
        const hasQuery = match.has
          ? match.has.map(
              (query) => searchParams.get(query.key) === query.value,
            )
          : true;
        return match.pathname === pathname && hasQuery;
      });
    }
    return matches?.some((match) => {
      const hasQuery = match.has
        ? match.has.map((query) => searchParams.get(query.key) === query.value)
        : true;
      return match.pathname === pathname && hasQuery;
    });
  }, [pathname, exact, matches]);

  if (isMatch) {
    return null;
  }

  return <>{children}</>;
}
