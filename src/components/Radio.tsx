'use client';

import { RegisterOptions, FieldValues, useFormContext } from 'react-hook-form';
import { CheckMarkSvg } from './pages/payment/PaymentRadioTab';
import { mergeCls } from '@/utils';

type HookFormRadioProps = JSX.IntrinsicElements['input'] & {
  name: string;
  className?: string;
  registerOptions?: RegisterOptions<FieldValues, string> | undefined;
  IconComponent?: JSX.Element;
  LabelComponent?: JSX.Element;
};
export function HookFormRadio(props: HookFormRadioProps) {
  const {
    id,
    name,
    IconComponent = <CheckMarkSvg />,
    LabelComponent,
    className = '',
    registerOptions,
    ...rest
  } = props;
  const { register } = useFormContext();

  return (
    <div className="flex items-center">
      <div className="relative after:absolute after:inset-0 after:rounded-full after:bg-default">
        <input
          id={id}
          type="radio"
          className={mergeCls(
            'peer relative block',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-white_primary/25 checked:after:bg-primary',
            'before:absolute before:-left-1 before:-top-1 before:h-[calc(100%+8px)] before:w-[calc(100%+8px)] hover:before:bg-white/30',
            'before:rounded-full before:transition-colors',
            'before:z-[1] after:z-[1]',
            className
          )}
          {...rest}
          {...register(name, registerOptions)}
        />
        {IconComponent}
      </div>
      {LabelComponent}
    </div>
  );
}
