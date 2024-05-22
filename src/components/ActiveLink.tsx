'use client';

import { usePathname } from 'next/navigation';
import React, { PropsWithChildren, useMemo } from 'react';

type ActiveLinkProps = PropsWithChildren<{
  matches: { name: string; exact?: boolean; regex?: boolean }[];
  allMatch?: boolean;
}>;
const ActiveLink = (props: ActiveLinkProps) => {
  const { children, matches, allMatch = false } = props;
  const pathname = usePathname();

  const isMatch = useMemo(() => {
    if (allMatch) {
      return matches?.every(({ name, exact, regex }) => {
        const against = regex ? new RegExp(name) : name;
        const match = pathname.match(against);
        if (exact) {
          return match && pathname === match[0];
        }
        return !!match;
      });
    }
    return matches?.some(({ name, exact, regex }) => {
      const against = regex ? new RegExp(name) : name;
      const match = pathname.match(against);
      if (exact) {
        return match && pathname === match[0];
      }
      return !!match;
    });
  }, [pathname, matches]);

  return <div className={`contents ${isMatch ? 'active-link ' : ''}`}>{children}</div>;
};

export default ActiveLink;
