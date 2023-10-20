"use client";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PropsWithChildren } from "react";

export const stripePromise = loadStripe(
  "pk_test_51Iwqe0KvZqrt4tRI0ZewUir13YIgFCeoaO9AQQb2w6a1Lu8AnWN2TypvEg4Q24xXXM8rL0BChZEjaIdx5FOYgVqQ0081tq7z3V",
);
export default function StripeElements({
  children,
  amount,
  currency,
}: PropsWithChildren<{ amount: number; currency: string }>) {
  if (amount < 0.5) {
    return <>{children}</>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        // clientSecret,
        amount,
        currency,
        mode: "payment",
        paymentMethodCreation: "manual",
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            family: "'Inter', sans-serif",
          },
        ],
        appearance: {
          variables: {
            fontFamily: "'Inter', sans-serif",
          },
          rules: {
            ".Label": {
              color: "rgb(245, 245, 245)",
              fontWeight: "500",
              marginBottom: "8px",
            },
            ".Input": {
              backgroundColor: "rgba(245, 245, 245, 0.15)",
              border: "none",
              color: "rgb(245, 245, 245)",
              marginBottom: "8px",
            },
            ".Input:hover": {
              backgroundColor: "rgba(245, 245, 245, 0.25)",
            },
            ".Error": {
              fontSize: "0.875rem",
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}

export function StripeCheckoutForm() {
  return (
    <PaymentElement
      options={{
        wallets: {
          googlePay: "never",
          applePay: "never",
        },
      }}
    />
  );
}
