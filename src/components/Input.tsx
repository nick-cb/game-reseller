import React from "react";
import { LabelHTMLAttributes, useState } from "react";

export function InputLabel({
  className = "",
  children,
  ...props
}: React.DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>) {
  return (
    <label
      className={"flex items-center gap-4 justify-between " + className}
      {...props}
    >
      {children}
    </label>
  );
}

export const InterposedInput = React.forwardRef<
  HTMLInputElement,
  {
    leftIcon?: string;
    rightIcon?: string;
    leftIconProps?: React.SVGProps<SVGSVGElement>;
    rightIconProps?: React.SVGProps<SVGSVGElement>;
    containerProps?: React.ComponentProps<typeof InputWrapper>;
    containerClassName?: string;
  } & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(function (
  {
    leftIcon,
    leftIconProps,
    rightIconProps,
    rightIcon,
    className = "",
    containerProps,
    ...props
  },
  ref,
) {
  const { className: leftIconCl = "" } = leftIconProps || {};
  const { className: rightIconCl = "" } = rightIconProps || {};

  return (
    <InputWrapper {...containerProps}>
      {leftIcon && (
        <svg {...leftIconProps} className={"w-5 h-5 " + leftIconCl}>
          <use xlinkHref={leftIcon}></use>
        </svg>
      )}
      <Input className={className} {...props} ref={ref} />
      {rightIcon && (
        <svg
          role="button"
          {...rightIconProps}
          className={"w-5 h-5 " + rightIconCl}
        >
          <use xlinkHref={rightIcon}></use>
        </svg>
      )}
    </InputWrapper>
  );
});

function InputWrapper({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={`flex items-center rounded
      bg-white/[0.15] hover:bg-white/[0.25] 
      transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(function ({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      name="keyword"
      className={`p-2 border-0 outline-offset-0 outline-0
        bg-transparent text-sm text-white
        w-[30ch] ${className}`}
      {...props}
    />
  );
});

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof InterposedInput>
>(function (props, ref) {
  const [show, setShow] = useState(false);

  return (
    <InterposedInput
      type={show ? "text" : "password"}
      leftIconProps={{
        className: "fill-white stroke-white ml-2",
      }}
      leftIcon="/svg/sprites/actions.svg#password"
      rightIcon={
        show
          ? "/svg/sprites/actions.svg#opened-eye"
          : "/svg/sprites/actions.svg#closed-eye"
      }
      rightIconProps={{
        className: "mr-2 fill-none stroke-white",
        onClick: () => {
          setShow((prev) => !prev);
        },
      }}
      placeholder="Enter your password"
      ref={ref}
      {...props}
    />
  );
});
