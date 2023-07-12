"use client";

import React, { PropsWithChildren } from "react";

const StandardButton = ({
  className = "",
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className={`w-full py-4 rounded 
      bg-primary text-white shadow-black shadow-md hover:brightness-125 transition-[filter]
      btn-default-scale [--duration:150ms] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default StandardButton;
