"use client";

import { useSearchParams } from "next/navigation";
import React, { PropsWithChildren, createContext, useMemo } from "react";

export const FilterContext = createContext<{
  filters: string[];
  searchParams: URLSearchParams | undefined;
}>({
  filters: [],
  searchParams: undefined,
});
const FilterContextProvider = ({ children }: PropsWithChildren) => {
  const searchParams = useSearchParams();
  const filters = searchParams.get("filters")?.split(",") || [];
  const value = useMemo(
    () => ({
      filters,
      searchParams: new URLSearchParams(searchParams.toString()),
    }),
    [filters, searchParams]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export default FilterContextProvider;
