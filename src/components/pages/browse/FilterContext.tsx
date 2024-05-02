"use client";

import { useSearchParams } from "next/navigation";
import React, { PropsWithChildren, createContext, useMemo } from "react";

export const FilterContext = createContext<{
  categories: string[];
  page: number;
  searchParams: URLSearchParams | undefined;
  collection: string | null;
}>({
  categories: [],
  page: 1,
  searchParams: undefined,
  collection: null,
});
const FilterContextProvider = ({ children }: PropsWithChildren) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const categories = searchParams.get("categories")?.split(",") || [];
  const collection = searchParams.get("collection");
  const value = useMemo(
    () => ({
      categories,
      collection,
      page: page && typeof page === "string" ? parseInt(page.toString()) : 0,
      searchParams: new URLSearchParams(searchParams.toString()),
    }),
    [categories, searchParams, collection],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export default FilterContextProvider;
