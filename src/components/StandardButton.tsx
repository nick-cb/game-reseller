"use client";

import { useLottie } from "lottie-react";
import React from "react";
import loadingData from "../../public/lotties/loading.json";

// TODO: Remove lottie
const StandardButton = ({
  className = "",
  children,
  loading,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { loading?: boolean }) => {
  const { View } = useLottie({
    animationData: loadingData,
    autoplay: true,
    loop: true,
    style: { width: 22, height: 22 },
  });

  return (
    <button
      className={`w-full py-4 rounded 
      bg-primary text-white shadow-black shadow-md hover:brightness-125 transition-[filter]
      btn-default-scale [--duration:150ms] flex justify-center items-center gap-2 ${className}`}
      {...props}
    >
      <div
        className={
          "w-0 h-0 overflow-hidden " + (loading ? "w-[22px] h-[22px]" : "")
        }
      >
        {View}
      </div>
      {children}
    </button>
  );
};

export default StandardButton;
