"use client";

import React from "react";
import SearchIcon from "./SearchIcon";
import { useRouter, useSearchParams } from "next/navigation";

const BrowseSearch = ({ className = "" }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <div
      className={
        className +
        " " +
        "bg-white/[0.15] hover:bg-white/25 transition-colors rounded flex items-center px-4"
      }
    >
      <SearchIcon />
      <input
        type="search"
        name="keyword"
        className="py-2 w-full rounded bg-transparent relative text-white_primary text-sm outline-none pl-2"
        placeholder="Search..."
        onChange={(e) => {
          const keyword = e.target.value;
          if (!keyword) {
            return router.push(`/browse`);
          }
          const params = new URLSearchParams(searchParams.toString());
          params.set("keyword", keyword);
          router.push(`/browse?${params.toString()}`);
        }}
      />
    </div>
  );
};

export default BrowseSearch;
