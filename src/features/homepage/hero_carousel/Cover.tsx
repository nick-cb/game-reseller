import React, { PropsWithChildren } from "react";

export const Cover = ({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={
        "main-item-cover absolute inset-0 flex flex-col-reverse p-8 justify-between gap-4 lg:gap-8 " +
        className
      }
    >
      {children}
    </div>
  );
};
