"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

const BrowseLink = ({
  href,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: URL | ((value: { searchParams: URLSearchParams }) => URL);
}) => {
  const searchParams = useSearchParams();
  const _href = useMemo(() => {
    if (typeof href === "function") {
      return href({
        searchParams: new URLSearchParams(searchParams.toString()),
      });
    }
    return href;
  }, [href, searchParams]);

  return <Link href={_href} {...props} />;
};

export default BrowseLink;
