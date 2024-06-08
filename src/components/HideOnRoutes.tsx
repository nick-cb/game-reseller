'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { PropsWithChildren, Suspense, useMemo } from 'react';

type HasCondition = {
  type: 'query';
  key: string;
  value?: string;
};
type HideOnRouteProps = PropsWithChildren<{
  exact?: boolean;
  matches: {
    pathname: string;
    has?: Array<HasCondition>;
    not?: Array<HasCondition>;
    exact?: boolean;
    regex?: boolean;
  }[];
}>;
export function HideOnRoute(props: HideOnRouteProps) {
  return (
    <Suspense>
      <HideOnRouteImplementation {...props} />
    </Suspense>
  );
}
type CheckHasConditionParams = {
  has: Array<HasCondition>;
  searchParams: URLSearchParams;
};
function checkHasCondition(params: CheckHasConditionParams) {
  const { has, searchParams } = params;
  for (const { type, key, value } of has) {
    if (type === 'query') {
      if (value ? searchParams.get(key) !== value : !searchParams.has(key)) {
        return false;
      }
    }
  }

  return true;
}
type CheckNotHasConditionParams = {
  not: Array<HasCondition>;
  searchParams: URLSearchParams;
};
function checkNotCondition(params: CheckNotHasConditionParams) {
  const { not, searchParams } = params;
  for (const { type, key, value } of not) {
    if (type === 'query') {
      if (value ? searchParams.get(key) === value : searchParams.has(key)) {
        return false;
      }
    }
  }

  return true;
}
function HideOnRouteImplementation(props: HideOnRouteProps) {
  const { children, matches, exact } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMatch = useMemo(() => {
    if (!matches) {
      return false;
    }
    if (exact) {
      return matches?.every((match) => {
        const { has = [], not = [] } = match;
        const against = match.regex ? new RegExp(match.pathname) : match.pathname;
        return (
          (match.exact ? match.pathname === pathname : pathname.match(against)) &&
          checkHasCondition({ has, searchParams }) &&
          checkNotCondition({ not, searchParams })
        );
      });
    }
    return matches?.some((match) => {
      const { has = [], not = [] } = match;
      const against = match.regex ? new RegExp(match.pathname) : match.pathname;
      return (
        (match.exact ? match.pathname === pathname : pathname.match(against)) &&
        checkHasCondition({ has, searchParams }) &&
        checkNotCondition({ not, searchParams })
      );
    });
  }, [pathname, exact, matches]);

  if (isMatch) {
    return null;
  }

  return <>{children}</>;
}
