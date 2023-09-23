"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const Pagination: React.FC<{
  total: number;
  currentPage: number;
  className?: string;
}> = ({ total, currentPage, className = "" }) => {
  const searchParams = useSearchParams();
  return (
    <ul
      className={
        className + " " + "flex justify-center items-center gap-2 w-full"
      }
    >
      {Array(total)
        .fill(null)
        .map((_, index) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", (index + 1).toString());
          return (
            <li key={index}>
              <Link
                href={`/browse?${params.toString()}`}
                className={
                  "text-white_primary py-2 px-4 bg-paper rounded block relative overflow-hidden " +
                  " after:hover:bg-white_primary/25 after:absolute after:inset-0 after:transition-colors " +
                  (currentPage === index + 1 ? " bg-white_primary/25" : "")
                }
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
