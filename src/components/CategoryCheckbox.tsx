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

  const { categories, searchParams } = useContext(FilterContext);
  const filteredByThisCat = useMemo(() => {
    return categories.findIndex((cat) => cat === tag_key);
  }, [categories]);
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
            const realPos = categories.findIndex((cat) => cat === tag_key);
            categories.splice(realPos, 1);
          } else {
            categories.push(tag_key);
          }
          if (categories.length > 0) {
            searchParams?.set("categories", categories.join(","));
          } else {
            searchParams?.delete("categories");
          }
          searchParams?.delete('page');
          console.log(`${pathname}${searchParams ? "?" + searchParams : ""}`);
          router.push(`${pathname}${searchParams ? "?" + searchParams : ""}`);
        }}
        {...props}
      />
    </>
  );
};
