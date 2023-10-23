"use client";

import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import { StripeElements, Stripe, PaymentIntent } from "@stripe/stripe-js";
import { Dialog, DialogContent } from "../Dialog";
import { SnackContext } from "../SnackContext";
import { useCartContext } from "../cart/CartContext";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateOrder } from "@/actions/orders";
import { useStripeNullish } from "../payment/Stripe";

// export function StripeElementNullish({
//   paymentIntent,
//   children,
// }: PropsWithChildren<{
//   paymentIntent: Stripe.Response<Stripe.PaymentIntent> | null;
// }>) {
//   if (paymentIntent && paymentIntent.client_secret) {
//     return null;
//   }
//   return <>{children}</>;
// }

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
export function CheckoutModal({
  SubmitButton,
  children,
}: PropsWithChildren<{
  SubmitButton: React.ReactElement;
}>) {
  const { gameList } = useCartContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showMessage } = useContext(SnackContext);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (gameList.filter((game) => game.checked).length === 0) {
            showMessage({ message: "No item selected", type: "warning" });
            return;
          }
          dialogRef.current?.showModal();
        }}
      >
        {SubmitButton}
      </form>
      <Dialog
        ref={dialogRef}
        remountChild
        className="lg:w-3/4 2xl:w-1/2 w-full !bg-default !p-0"
      >
        <DialogContent as="div" className="p-4">
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

type CheckoutFormPayload = {
  method_id?: string;
  method: "stripe" | "paypal";
  save: "yes" | "no";
};
export function CheckoutForm({
  children,
  payWithStripe,
  ...props
}: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
  payWithStripe: (payload: { paymentMethod: string; save: boolean }) => Promise<
    | {
        error: string;
      }
    | {
        orderId: number;
        clientSecret: string;
        status: PaymentIntent.Status;
      }
  >;
}) {
  const { stripe, elements } = useStripeNullish();
  const { showMessage } = useContext(SnackContext);
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const form = useForm<CheckoutFormPayload>({
    mode: "onSubmit",
    defaultValues: {
      method_id: undefined,
    },
    shouldUnregister: true,
  });

  const observeNextActionModal = () => {
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        const addedNode = mutation.addedNodes.item(0);
        const iframeNode = addedNode?.childNodes.item(0);
        if (addedNode && iframeNode instanceof HTMLIFrameElement) {
          ref.current?.appendChild(iframeNode);
          ref.current?.showModal();
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
    });

    return observer;
  };

  const createPaymentMethod = async (
    stripe: Stripe,
    element: StripeElements,
  ) => {
    const { error: elementError } = await element.submit();
    if (elementError && elementError?.message) {
      throw new Error(elementError.message);
    }
    const { paymentMethod, error: createPaymentError } =
      await stripe.createPaymentMethod({
        elements: element,
      });
    if (createPaymentError && createPaymentError.message) {
      throw new Error(createPaymentError.message);
    }
    if (!paymentMethod) {
      throw new Error("Invalid payment method");
    }
    return paymentMethod.id;
  };

  return (
    <>
      <FormProvider {...form}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!stripe || !elements) {
              return;
            }
            await form.handleSubmit(async ({ save, method_id }) => {
              const observer = observeNextActionModal();
              try {
                const methodId =
                  method_id || (await createPaymentMethod(stripe, elements));
                const response =
                  (await payWithStripe({
                    save: save === "yes" ? true : false,
                    paymentMethod: methodId,
                  })) || {};
                if ("error" in response) {
                  throw new Error(response.error);
                }
                const { clientSecret, status, orderId } = response;
                if (clientSecret && status === "requires_action") {
                  const { error, paymentIntent } =
                    await stripe.handleNextAction({
                      clientSecret,
                    });
                  if (
                    paymentIntent?.id &&
                    paymentIntent.status !== "requires_action"
                  ) {
                    await updateOrder(orderId, {
                      order: { status: paymentIntent.status },
                    });
                  }
                  const nextActionModal = ref.current;
                  if (!nextActionModal) {
                    return;
                  }
                  if (error?.message) {
                    throw new Error(error.message);
                  }
                  nextActionModal.close();
                  observer.disconnect();
                  router.refresh();
                  return router.push("/order/completed?order_id=" + orderId);
                }
                router.refresh();
                router.push("/order/completed?order_id=" + orderId);
              } catch (error) {
                if (error instanceof Error) {
                  showMessage({ message: error.message, type: "error" });
                }
              }
            })();
          }}
          {...props}
        >
          {children}
        </form>
      </FormProvider>
      <Dialog
        ref={ref}
        className="h-full w-full !bg-transparent backdrop-filter-none !shadow-none"
      ></Dialog>
    </>
  );
}
