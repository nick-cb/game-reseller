'use client';

import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren, useTransition } from 'react';
import { LoadingIcon2 } from '../../loading/LoadingIcon';
import CheckoutActions from '@/+actions/checkout-actions';

export function RemoveCardBtn({
  paymentMethod,
  children,
  ...props
}: PropsWithChildren<
  { paymentMethod: { id: string } } & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>) {
  const [deleting, startDelete] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startDelete(async () => {
          await CheckoutActions.payments.removePaymentMethod(paymentMethod.id);
          router.refresh();
        });
      }}
      {...props}
    >
      {deleting ? (
        <LoadingIcon2 fill="white" stroke={'#9c9c9c'} width={24} height={24} loading={deleting} />
      ) : (
        children
      )}
    </button>
  );
}
