"use client";

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
  SVGProps,
} from "react";
import { HookFormRadio } from "../Radio";
import { useController, useFormContext } from "react-hook-form";
import {useScroll} from "@/components/scroll/hook";

export function PaymentTabButton({
  // icon,
  children,
  className,
  type,
  index,
  method,
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
  PropsWithChildren<{ index: number; method: "stripe" | "paypal" }>) {
  const { control } = useFormContext();
  const {
    field: { onChange, value, ref },
  } = useController({ control, name: "payment_method" });
  const { elements, scrollToIndex } = useScroll();
  const active = elements.findIndex((el) => el.isIntersecting) === index;
  if (active && value !== method) {
    // resetField("method_id", { defaultValue: "" });
    onChange(method);
  }

  return (
    <li
      className={
        " 3/4sm:w-28 3/4sm:h-24 rounded-md border-2 border-solid snap-start " +
        " w-24 h-20 " +
        " transition-colors hover:bg-white/25 " +
        " gap-2 relative " +
        (active ? " border-primary " : " border-white/25 ")
      }
    >
      <input
        type={"radio"}
        id={method}
        name={"payment_method"}
        checked={active}
        value={method}
        onChange={(event) => {
          scrollToIndex(index);
          onChange(event);
        }}
        ref={ref}
        className={"w-full h-full absolute " + "rounded-md " + className}
        {...props}
      />
      <label
        htmlFor={method}
        className={
          "text-sm w-full h-full block bg-paper rounded-md " +
          "absolute w-full h-full inset-0 flex flex-col justify-center items-center " +
          "hover:after:bg-white_primary/[.15] after:absolute after:inset-0 after:rounded-md " +
          "transition-colors "
        }
      >
        {children}
      </label>
    </li>
  );
}

export function SpriteIcon({
  sprite,
  id,
  ...props
}: { sprite: string; id: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={32} height={32} className="mb-2 mx-auto" {...props}>
      <use xlinkHref={`/svg/sprites/${sprite}.svg#${id}`} />
    </svg>
  );
}

export function CheckMarkSvg() {
  return (
    <svg
      id="checkmark"
      viewBox="0 0 32 32"
      fill="none"
      stroke="white"
      width={24}
      height={24}
      className={
        "absolute inset-0 z-10 -left-[2px] -top-[2px] pointer-events-none"
      }
    >
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="4"
        strokeWidth="2"
        d="M22.867 26.267c-1.933 1.333-4.333 2.067-6.867 2.067-6.8 0-12.333-5.533-12.333-12.333 0-2.933 1.067-5.667 2.733-7.8"
        className="svg-elem-1"
      ></path>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="4"
        strokeWidth="2"
        d="M13.4 3.933c0.867-0.2 1.733-0.267 2.6-0.267 6.8 0 12.333 5.533 12.333 12.333 0 1.933-0.467 3.733-1.2 5.333"
        className="svg-elem-2"
      ></path>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="4"
        strokeWidth="2"
        d="M11 16.333l3.333 3.333 6.667-6.667"
        className="svg-elem-3"
      ></path>
    </svg>
  );
}

export function SavePayment({ id }: { id: string }) {
  return (
    <>
      <p className="text-[14.88px] mb-2 ">
        Save this payment method for future purchases
      </p>
      <div className="flex gap-8">
        <HookFormRadio
          id={id + "-remember-yes"}
          name="save"
          value={"yes"}
          LabelComponent={
            <label htmlFor={id + "-remember-yes"} className="pl-2">
              Yes
            </label>
          }
          className="w-5 h-5"
        />
        <HookFormRadio
          id={id + "-remember-no"}
          name="save"
          value={"no"}
          LabelComponent={
            <label htmlFor={id + "-remember-no"} className="pl-2">
              No
            </label>
          }
          className="w-5 h-5"
        />
        <CheckMarkSvg />
      </div>
      <p className="text-xs text-white_primary/60 mt-2">
        By choosing to save your payment information, this payment method will
        be selected as the default for all purchases made using our payment. You
        can delete your saved payment information anytime on this payment screen
        or by logging in to your account, and selecting payment management in
        your account settings.
      </p>
    </>
  );
}
