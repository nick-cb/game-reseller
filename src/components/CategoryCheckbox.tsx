"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useMemo, useState } from "react";
import { FilterContext } from "./FilterContext";

export const CategoryCheckbox = ({
  categoryName,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { categoryName: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { filters, searchParams } = useContext(FilterContext);
  const filteredByThisCat = useMemo(() => {
    return filters.findIndex((cat) => cat === categoryName);
  }, [filters]);
  const [_checked, setChecked] = useState(filteredByThisCat > -1);
  if (filteredByThisCat === -1 && _checked) {
    setChecked(false);
  } else if (filteredByThisCat !== -1 && !_checked) {
    setChecked(true);
  }

  return (
    <>
      {/* <div className="absolute right-2 translate-y-1/2"> */}
      {/*   <SpinnerIcon isLoading={filtering} /> */}
      {/* </div> */}
      <input
        name={`filters:${categoryName}`}
        type="checkbox"
        aria-checked={_checked}
        onChange={() => {
          setChecked((prev) => {
            if (prev) {
              const realPos = filters.findIndex((cat) => cat === categoryName);
              filters.splice(realPos, 1);
            } else {
              filters.push(categoryName);
            }
            if (filters.length > 0) {
              searchParams?.set("filters", filters.join(","));
            } else {
              searchParams?.delete("filters");
            }
            router.push(`${pathname}${searchParams ? "?" + searchParams : ""}`);
            return !prev;
          });
        }}
        checked={_checked}
        {...props}
      />
    </>
  );
};
