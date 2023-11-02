"use client";

import React from "react";
import { LoadingIcon } from "./loading/LoadingIcon";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useFormContext, useFormState } from "react-hook-form";
const StandardButton = ({
  className = "",
  children,
  loading = false,
  submittingDisabled,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { loading?: boolean; submittingDisabled?: boolean }) => {
  const formState = useFormStatus();
  const _loading = loading ?? formState.pending;
  const disable = submittingDisabled && _loading;

  return (
    <button
      className={`w-full py-4 rounded 
      bg-primary text-white shadow-black/40 shadow-md [&:not([disabled])]:hover:brightness-125 transition-[filter]
      btn-default-scale [--duration:150ms] flex justify-center items-center gap-2 ${className}
      disabled:bg-[hsl(209,_70%,_45%)]`}
      disabled={disable}
      {...props}
    >
      <LoadingIcon loading={loading} />
      {children}
    </button>
  );
};

export function HookFormPrimaryButton({
  ...props
}: Omit<React.ComponentProps<typeof StandardButton>, "loading">) {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ control });
  return <StandardButton {...props} loading={isSubmitting} />;
}

export default StandardButton;
