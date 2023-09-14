"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const Pagination: React.FC<{ total: number; className?: string }> = ({
  total,
  className = "",
}) => {
  const searchParams = useSearchParams();
  return (
    <ul className={className + " " + "flex justify-center items-center gap-2 w-full"}>
      {Array(total)
        .fill(null)
        .map((_, index) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", (index + 1).toString());
          return (
            <li>
              <Link
                href={`/browse?${params.toString()}`}
                className="text-white_primary py-2 px-4 bg-primary rounded block"
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
