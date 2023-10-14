"use client";

import React from "react";
import { LoadingIcon } from "./loading/LoadingIcon";
const StandardButton = ({
  className = "",
  children,
  loading = false,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { loading?: boolean }) => {
  return (
    <button
      className={`w-full py-4 rounded 
      bg-primary text-white shadow-black/40 shadow-md hover:brightness-125 transition-[filter]
      btn-default-scale [--duration:150ms] flex justify-center items-center gap-2 ${className}`}
      {...props}
    >
      <LoadingIcon loading={loading} />
      {children}
    </button>
  );
};

export default StandardButton;
