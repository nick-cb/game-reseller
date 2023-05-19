"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const Pagination: React.FC<{ total: number }> = ({ total }) => {
  const searchParams = useSearchParams();
  return (
    <ul>
      {Array(total)
        .fill(null)
        .map((_, index) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", (index + 1).toString());
          return (
            <li>
              <Link
                href={`/browse?${params.toString()}`}
                className="text-white_primary"
              >
                {index + 1}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default Pagination;
