import { mergeCls } from '@/utils';
import Link from 'next/link';
import { ComponentProps } from 'react';

export type ButtonProps = JSX.IntrinsicElements['button'] & {
  size?: 'sm' | 'md' | 'lg' | 'xs';
  variant?: 'primary' | 'secondary' | 'severity' | 'wildcard';
};
export function Button(props: ButtonProps) {
  const { size = 'md', variant = 'primary', className, ...rest } = props;

  return (
    <button
      className={mergeCls(
        'transition-[filter] [&:not([disabled])]:hover:brightness-110',
        'btn-default-scale flex items-center justify-center gap-2 [--duration:150ms]',
        'transition-colors disabled:shadow-none disabled:saturate-50',
        variant,
        size,
        // size === 'sm' && (variant === 'primary' ? 'h-10' : 'h-[calc(2.5rem_-_2px)]'),
        // size === 'md' && (variant === 'primary' ? 'h-12' : 'h-[calc(3rem_-_2px)]'),
        // size === 'lg' && (variant === 'primary' ? 'h-14' : 'h-[calc(3.5rem_-_2px)]'),
        className
      )}
      {...rest}
    />
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'tertiary';
};
export function ButtonLink(props: ButtonLinkProps) {
  const { size = 'md', variant = 'primary', className, ...rest } = props;

  return (
    <Link
      className={mergeCls(
        'transition-[filter] [&:not([disabled])]:hover:brightness-110',
        'btn-default-scale flex items-center justify-center gap-2 [--duration:150ms] [--scale:0.98]',
        'disabled:saturate-50',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'border border-white/60 text-white hover:bg-paper',
        size === 'xs' && 'h-8 rounded px-3 text-xs shadow-sm shadow-black/25',
        size === 'sm' && 'h-10 rounded px-4 text-sm shadow-sm shadow-black/25',
        size === 'md' && 'h-12 rounded px-6 text-base shadow shadow-black/40',
        size === 'lg' && 'h-14 px-8 text-lg',
        // size === 'sm' && (variant === 'primary' ? 'h-10' : 'h-[calc(2.5rem_-_2px)]'),
        // size === 'md' && (variant === 'primary' ? 'h-12' : 'h-[calc(3rem_-_2px)]'),
        // size === 'lg' && (variant === 'primary' ? 'h-14' : 'h-[calc(3.5rem_-_2px)]'),
        className
      )}
      {...rest}
    />
  );
}
