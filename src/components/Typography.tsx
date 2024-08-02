import { mergeCls } from '@/utils';
import React from 'react';

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextProps = React.ComponentPropsWithoutRef<'p' | Heading> & {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'on-primary' | 'on-secondary' | 'on-tertiary' | 'on-primary-container';
  dim?: boolean;
  as?: 'p' | Heading;
};
export function Text(props: TextProps) {
  const {
    size = 'sm',
    variant = 'on-primary-container',
    dim,
    as: component = 'p',
    className,
    ...rest
  } = props;

  const Component: `${TextProps['as']}` = `${component}`;

  return (
    <Component
      className={mergeCls(
        size === 'xs' && 'text-xs',
        size === 'sm' && 'text-sm',
        size === 'base' && 'text-sm lg:text-base',
        size === 'lg' && 'text-base lg:text-lg',
        size === 'xl' && 'text-base md:text-lg lg:text-xl',
        variant === 'on-primary-container' && dim && 'text-[hsl(0_0%_76%)]',
        variant === 'on-primary-container' && !dim && 'text-[hsl(0_0%_96%)]',
        className
      )}
      {...rest}
    />
  );
}

type HeadingProps = React.ComponentPropsWithoutRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
};
export function Heading(props: HeadingProps) {
  const { level, className, ...rest } = props;
  const Component: `h${HeadingProps['level']}` = `h${level}`;

  return <Component className={mergeCls(level === 1 && '', className)} {...rest} />;
}

/*
 * 2xl -> 1536
 * xl -> 1280
 * lg -> 1024
 * md -> 768
 * sm -> 640
 * 2xs -> 512
 * xs -> 384
 */

/*
 * text-sm + lg -> text-xs + sm -> text-xs + xs
 * text-base + lg -> text-sm + sm -> text-xs + xs
 * text-lg + lg -> text-base + sm -> text-sm + xs
 * text-xl + lg -> text-lg + sm -> text-base + xs
 */

/*
 * p -> xs -> *sm* -> base -> lg -> xl
 * h6
 * h5
 * h4
 * h3
 * h2
 * h1
 */
