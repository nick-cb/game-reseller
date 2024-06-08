'use client';

import React from 'react';
import { LoadingIcon } from './loading/LoadingIcon';
import { useFormStatus } from 'react-dom';
import { useFormContext, useFormState } from 'react-hook-form';
import { mergeCls } from '@/utils';
const StandardButton = ({
  className = '',
  children,
  loading = false,
  submittingDisabled,
  ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  loading?: boolean;
  submittingDisabled?: boolean;
}) => {
  const formState = useFormStatus();
  const _loading = loading ?? formState.pending;
  const disable = submittingDisabled && _loading;

  return (
    <button
      className={mergeCls(
        'w-full rounded py-3 sm:py-4',
        'bg-primary text-white shadow shadow-black/40 transition-[filter] [&:not([disabled])]:hover:brightness-125',
        'btn-default-scale flex items-center justify-center gap-2 [--duration:150ms]',
        'disabled:bg-[hsl(209,_70%,_45%)]',
        className
      )}
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
}: Omit<React.ComponentProps<typeof StandardButton>, 'loading'>) {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ control });
  return <StandardButton {...props} loading={isSubmitting} />;
}

export default StandardButton;
