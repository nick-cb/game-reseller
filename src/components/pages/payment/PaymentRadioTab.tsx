'use client';

import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren, SVGProps } from 'react';
import { HookFormRadio } from '../../Radio';
import { useController, useFormContext } from 'react-hook-form';
import { useScroll } from '@/components/scroll/ScrollPrimitive';
import { mergeCls } from '@/utils';

type PaymentTabButtonProps = PropsWithChildren<{ index: number; method: 'stripe' | 'paypal' }>;
export function PaymentTabButton(props: PaymentTabButtonProps) {
  const { children, index, method } = props;
  const { control } = useFormContext();
  const {
    field: { onChange, value, ref },
  } = useController({ control, name: 'payment_method' });
  const { entries, scrollToIndex } = useScroll();
  const active = entries[index]?.isIntersecting;
  if (active && value !== method) {
    onChange(method);
  }

  return (
    <li
      className={
        ' snap-start rounded-md border-2 border-solid 3/4sm:h-24 3/4sm:w-28 ' +
        ' h-20 w-24 ' +
        ' transition-colors hover:bg-white/25 ' +
        ' relative gap-2 ' +
        (active ? ' border-primary ' : ' border-white/25 ')
      }
    >
      <input
        type={'radio'}
        id={method}
        name={'payment_method'}
        checked={active}
        value={method}
        onChange={(event) => {
          scrollToIndex(index);
          onChange(event);
        }}
        ref={ref}
        className={mergeCls('absolute h-full w-full', 'rounded-md')}
      />
      <label
        htmlFor={method}
        className={
          'block h-full w-full rounded-md bg-paper text-sm ' +
          'absolute inset-0 flex h-full w-full flex-col items-center justify-center ' +
          'after:absolute after:inset-0 after:rounded-md hover:after:bg-white_primary/[.15] ' +
          'transition-colors '
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
    <svg width={32} height={32} className="mx-auto mb-2" {...props}>
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
      className={'pointer-events-none absolute inset-0 -left-[2px] -top-[2px] z-10'}
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
      <p className="mb-2 text-[14.88px] ">Save this payment method for future purchases</p>
      <div className="flex gap-8">
        <HookFormRadio
          id={id + '-remember-yes'}
          name="save"
          value={'yes'}
          LabelComponent={
            <label htmlFor={id + '-remember-yes'} className="pl-2">
              Yes
            </label>
          }
          className="h-5 w-5"
        />
        <HookFormRadio
          id={id + '-remember-no'}
          name="save"
          value={'no'}
          LabelComponent={
            <label htmlFor={id + '-remember-no'} className="pl-2">
              No
            </label>
          }
          className="h-5 w-5"
        />
        <CheckMarkSvg />
      </div>
      <p className="mt-2 text-xs text-white_primary/60">
        By choosing to save your payment information, this payment method will be selected as the
        default for all purchases made using our payment. You can delete your saved payment
        information anytime on this payment screen or by logging in to your account, and selecting
        payment management in your account settings.
      </p>
    </>
  );
}
