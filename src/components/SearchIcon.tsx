import React, { SVGProps } from "react";

const SearchIcon = ({
  width = 20,
  height = 20,
  ...props
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      version="1.1"
      baseProfile="basic"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 64 64"
      {...props}
    >
      <path
        d="M27,9c9.925,0,18,8.075,18,18s-8.075,18-18,18S9,36.925,9,27S17.075,9,27,9z M27,41c7.719,0,14-6.281,14-14s-6.281-14-14-14 s-14,6.281-14,14S19.281,41,27,41z"
        fill="white"
        strokeWidth={1}
        stroke="white"
      />
      <path
        d="M54.322,51.049c0.904,0.904,0.904,2.369,0,3.273c-0.904,0.904-2.369,0.904-3.273,0C50.597,53.87,37,40.273,37,40.273 L40.273,37C40.273,37,53.87,50.597,54.322,51.049z"
        fill="white"
        strokeWidth={2}
        stroke="white"
      />
    </svg>
  );
};

export default SearchIcon;
