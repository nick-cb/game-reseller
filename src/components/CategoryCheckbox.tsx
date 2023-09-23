"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useMemo, useState } from "react";
import { FilterContext } from "./FilterContext";
import { Tags } from "@/database/models";

export const CategoryCheckbox = ({
  tag,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { tag: Tags }) => {
  const { tag_key } = tag;
  const router = useRouter();
  const pathname = usePathname();

  const { filters, searchParams } = useContext(FilterContext);
  const filteredByThisCat = useMemo(() => {
    return filters.findIndex((cat) => cat === tag_key);
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
        name={`filters:${tag_key}`}
        type="checkbox"
        aria-checked={_checked}
        onChange={() => {
          setChecked((prev) => {
            return !prev;
          });
          if (_checked) {
            const realPos = filters.findIndex((cat) => cat === tag_key);
            filters.splice(realPos, 1);
          } else {
            filters.push(tag_key);
          }
          if (filters.length > 0) {
            searchParams?.set("filters", filters.join(","));
          } else {
            searchParams?.delete("filters");
          }
          searchParams?.delete('page');
          router.push(`${pathname}${searchParams ? "?" + searchParams : ""}`);
        }}
        checked={_checked}
        {...props}
      />
    </>
  );
};
