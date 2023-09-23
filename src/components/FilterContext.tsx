"use client";

import { useSearchParams } from "next/navigation";
import React, { PropsWithChildren, createContext, useMemo } from "react";

export const FilterContext = createContext<{
  filters: string[];
  page: number;
  searchParams: URLSearchParams | undefined;
}>({
  filters: [],
  page: 1,
  searchParams: undefined,
});
const FilterContextProvider = ({ children }: PropsWithChildren) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const filters = searchParams.get("filters")?.split(",") || [];
  const value = useMemo(
    () => ({
      filters,
      page: page && typeof page === "string" ? parseInt(page.toString()) : 0,
      searchParams: new URLSearchParams(searchParams.toString()),
    }),
    [filters, searchParams],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export default FilterContextProvider;
