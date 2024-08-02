'use client';

import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from 'react';
import { StripeElements, Stripe, PaymentIntent } from '@stripe/stripe-js';
import { Dialog, DialogContent } from '../../Dialog';
import { SnackContext } from '../../SnackContext';
import { useCartContext } from '../cart/CartContext';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useStripeNullish } from '@/components/pages/payment/Stripe';
import CheckoutActions from '@/+actions/checkout-actions';

const checkoutContext = createContext<{
  stripe: Stripe | null;
  elements: StripeElements | null;
}>({
  stripe: null,
  elements: null,
});
export function useCheckout() {
  const value = useContext(checkoutContext);
  return value;
}
export const checkoutModalCtx = createContext<{
  hideModal: () => void;
  showModal: () => void;
}>({
  hideModal: () => {},
  showModal: () => {},
});

type CheckoutModalProps = PropsWithChildren<{
  SubmitButton: React.ReactElement;
}>;
export function CheckoutModal({ SubmitButton, children }: CheckoutModalProps) {
  const { gameList } = useCartContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showMessage } = useContext(SnackContext);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (gameList.filter((game) => game.checked).length === 0) {
            showMessage({ message: 'No item selected', type: 'warning' });
            return;
          }
          dialogRef.current?.showModal();
        }}
      >
        {SubmitButton}
      </form>
      <Dialog ref={dialogRef} remountChild className="w-full !bg-default !p-0 lg:w-3/4 2xl:w-2/3">
        <DialogContent as="div" className="w-full p-4">
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

type CheckoutFormPayload = {
  method_id?: string;
  method: 'stripe' | 'paypal';
  save: 'yes' | 'no';
};
type CheckoutFormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
  payWithStripe: (payload: { paymentMethod: string; save: boolean }) => Promise<
    | {
        error: string;
      }
    | {
        orderID: number;
        clientSecret: string;
        status: PaymentIntent.Status;
        error?: undefined;
      }
  >;
};
export function CheckoutForm(props: CheckoutFormProps) {
  const { children, payWithStripe, ...rest } = props;
  const { stripe, elements } = useStripeNullish();
  const { showMessage } = useContext(SnackContext);
  const nextActionModalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const form = useForm<CheckoutFormPayload>({
    mode: 'onSubmit',
    defaultValues: {
      method_id: undefined,
    },
    shouldUnregister: true,
  });

  const handleSubmit = async (params: CheckoutFormPayload) => {
    const { save, method_id } = params;
    if (!stripe || !elements) {
      return;
    }
    const observer = observeNextActionModal();
    try {
      const methodId = method_id || (await createPaymentMethod(stripe, elements));
      const response = await payWithStripe({
        save: save === 'yes' ? true : false,
        paymentMethod: methodId,
      });
      if ('error' in response) {
        throw new Error(response.error);
      }
      const { clientSecret, status, orderID: orderId } = response;
      if (clientSecret && status === 'requires_action') {
        handleNextAction(stripe, orderId, clientSecret);
        observer.disconnect();
      }
      router.refresh();
      router.push('/order/success?order_id=' + orderId);
    } catch (error) {
      if (error instanceof Error) {
        showMessage({ message: error.message, type: 'error' });
      }
      observer.disconnect();
    }
  };

  const createPaymentMethod = async (stripe: Stripe, element: StripeElements) => {
    const { error: elementError } = await element.submit();
    if (elementError && elementError?.message) {
      throw new Error(elementError.message);
    }
    const { paymentMethod, error: createPaymentError } = await stripe.createPaymentMethod({
      elements: element,
    });
    if (createPaymentError && createPaymentError.message) {
      throw new Error(createPaymentError.message);
    }
    if (!paymentMethod) {
      throw new Error('Invalid payment method');
    }
    return paymentMethod.id;
  };

  const handleNextAction = async (stripe: Stripe, orderId: number, clientSecret: string) => {
    const { error, paymentIntent } = await stripe.handleNextAction({
      clientSecret,
    });
    if (paymentIntent?.id && paymentIntent.status !== 'requires_action') {
      await CheckoutActions.payments.updateOrderPaymentIntent(orderId, paymentIntent.id);
    }
    const nextActionModal = nextActionModalRef.current;
    if (!nextActionModal) {
      return;
    }
    if (error?.message) {
      throw new Error(error.message);
    }
    nextActionModal.close();
  };

  const observeNextActionModal = () => {
    // We're using the dialog element, which will be put on the top-level layer
    // and cover everything, include the Stripe's iframe. So we need to move the
    // iframe to it own dialog element to make it visible.
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        const addedNode = mutation.addedNodes.item(0);
        const iframeNode = addedNode?.childNodes.item(0);
        if (addedNode && iframeNode instanceof HTMLIFrameElement) {
          nextActionModalRef.current?.appendChild(iframeNode);
          nextActionModalRef.current?.showModal();
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
    });

    return observer;
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} {...rest}>
          {children}
        </form>
      </FormProvider>
      <Dialog
        ref={nextActionModalRef}
        className="h-full w-full !bg-transparent !shadow-none backdrop-filter-none"
      ></Dialog>
    </>
  );
}
