"use client";

import { HookFormPrimaryButton } from "../StandardButton";
import { AnimatedIcon } from "../icons/animated";
import { useFormContext, useWatch } from "react-hook-form";

export function PlaceOrderButton({
  children,
  ...props
}: React.ComponentProps<typeof HookFormPrimaryButton>) {
  const { control } = useFormContext();
  const method: "stripe" | "paypal" = useWatch({
    control,
    name: "payment_method",
  });

  return (
    <HookFormPrimaryButton
      type="submit"
      className={
        "h-14 relative " +
        "before:absolute before:inset-0 before:bg-[rgb(255,_196,_57)] " +
        " before:rounded hover:!brightness-90 before:transition-[width] " +
        " before:w-0 " +
        (method === "paypal" ? " before:w-full " : "") +
        " before:duration-200 "
      }
      {...props}
    >
      <AnimatedIcon.Paypal show={method === "paypal"} />
      <span
        className={
          "relative transition-colors delay-[25ms] duration-[175ms] " +
          (method === "paypal" ? " text-default " : "")
        }
      >
        {children}
      </span>
    </HookFormPrimaryButton>
  );
}
