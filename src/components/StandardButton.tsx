"use client";

import React from "react";

const StandardButton = ({
  className = "",
  children,
  loading,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { loading?: boolean }) => {
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
