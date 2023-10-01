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
    pathname: string | RegExp;
    has?: [
      {
        type: "query";
        key: string;
        value: string;
      },
    ];
    exact?: boolean;
  }[];
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMatch = useMemo(() => {
    console.log({ pathname, exact });
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
        return (
          (match.exact
            ? match.pathname === pathname
            : pathname.match(match.pathname)) && hasQuery
        );
      });
    }
    console.log(matches);
    return matches?.some((match) => {
      const hasQuery = match.has
        ? match.has.map((query) => searchParams.get(query.key) === query.value)
        : true;
      console.log(
        (match.exact
          ? match.pathname === pathname
          : pathname.match(match.pathname)) && hasQuery,
      );
      return (
        (match.exact
          ? match.pathname === pathname
          : pathname.match(match.pathname)) && hasQuery
      );
    });
  }, [pathname, exact, matches]);

  if (isMatch) {
    return null;
  }

  return <>{children}</>;
}
