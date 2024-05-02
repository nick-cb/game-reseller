"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import { DetailedHTMLProps, FormHTMLAttributes, useContext } from "react";
import { SnackContext } from "../../SnackContext";

export function PlaceOrderForm({
  children,
  action,
}: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
  const stripe = useStripe();
  const element = useElements();
  const { showMessage } = useContext(SnackContext);

  return (
    <form
      action={action}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!stripe || !element) {
          return;
        }

        try {
          const { error: elementError } = await element.submit();
          if (elementError && elementError?.message) {
            return showMessage({
              message: elementError.message,
              type: "error",
            });
          }
          const { paymentMethod, error: createPaymentError } =
            await stripe.createPaymentMethod({
              elements: element,
            });
          if (createPaymentError && createPaymentError.message) {
            return showMessage({
              message: createPaymentError.message,
              type: "error",
            });
          }
          if (!paymentMethod) {
            return showMessage({
              message: "Invalid payment method",
              type: "error",
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
        }
      }}
    >
      {children}
    </form>
  );
}
