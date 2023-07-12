import { LabelHTMLAttributes, useMemo, useState } from "react";

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

export function InterposedInput({
  leftIcon,
  leftIconProps,
  rightIconProps,
  rightIcon,
  className = "",
  containerProps,
  ...props
}: {
  leftIcon?: string;
  rightIcon?: string;
  leftIconProps?: React.SVGProps<SVGSVGElement>;
  rightIconProps?: React.SVGProps<SVGSVGElement>;
  containerProps?: React.ComponentProps<typeof InputWrapper>;
  containerClassName?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const { className: leftIconCl = "" } = leftIconProps || {};
  const { className: rightIconCl = "" } = rightIconProps || {};

  return (
    <InputWrapper {...containerProps}>
      {leftIcon && (
        <svg {...leftIconProps} className={"w-5 h-5 " + leftIconCl}>
          <use xlinkHref={leftIcon}></use>
        </svg>
      )}
      <Input className={className} {...props} />
      {rightIcon && (
        <svg {...rightIconProps} className={"w-5 h-5 " + rightIconCl}>
          <use xlinkHref={rightIcon}></use>
        </svg>
      )}
    </InputWrapper>
  );
}

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

function Input({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <input
      name="keyword"
      className={`p-2 border-0 outline-offset-0 outline-0
        bg-transparent text-sm text-white
        w-[30ch] ${className}`}
      {...props}
    />
  );
}

export function PasswordInput(
  props: React.ComponentProps<typeof InterposedInput>
) {
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
      {...props}
    />
  );
}
