import React, { forwardRef } from 'react';
import { LabelHTMLAttributes, useState } from 'react';

type InputLabelProps = React.DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;
export function InputLabel(props: InputLabelProps) {
  const { className = '', children, ...rest } = props;
  return (
    <label className={'flex items-center justify-between gap-4 ' + className} {...rest}>
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
  } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(function (
  { leftIcon, leftIconProps, rightIconProps, rightIcon, className = '', containerProps, ...props },
  ref
) {
  const { className: leftIconCl = '' } = leftIconProps || {};
  const { className: rightIconCl = '' } = rightIconProps || {};

  return (
    <InputWrapper {...containerProps}>
      {leftIcon && (
        <svg {...leftIconProps} className={'h-5 w-5 ' + leftIconCl}>
          <use xlinkHref={leftIcon}></use>
        </svg>
      )}
      <Input className={className} {...props} ref={ref} />
      {rightIcon && (
        <svg role="button" {...rightIconProps} className={'h-5 w-5 ' + rightIconCl}>
          <use xlinkHref={rightIcon}></use>
        </svg>
      )}
    </InputWrapper>
  );
});

type DualIconInputProps = JSX.IntrinsicElements['div'] & {
  lefIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};
export const DualIconWrapper = forwardRef<HTMLDivElement, DualIconInputProps>(
  function (props, ref) {
    const { lefIcon, rightIcon, children, ...rest } = props;

    return (
      <InputWrapper {...rest} ref={ref}>
        {lefIcon}
        {children}
        {rightIcon}
      </InputWrapper>
    );
  }
);

export function InputWrapper({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      className={`flex items-center rounded
      bg-white/[0.15] transition-colors 
      hover:bg-white/[0.25] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(function ({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      name="keyword"
      className={`w-[30ch] border-0 bg-transparent p-2
        text-sm text-white outline-0
        outline-offset-0 ${className}`}
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
      type={show ? 'text' : 'password'}
      leftIconProps={{
        className: 'fill-white stroke-white ml-2',
      }}
      leftIcon="/svg/sprites/actions.svg#password"
      rightIcon={
        show ? '/svg/sprites/actions.svg#opened-eye' : '/svg/sprites/actions.svg#closed-eye'
      }
      rightIconProps={{
        className: 'mr-2 fill-none stroke-white',
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
