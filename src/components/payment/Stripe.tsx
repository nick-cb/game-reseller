"use client";
import { Elements, CardElement, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from "react";
import { Controller, useController, UseFormReturn } from "react-hook-form";

const stripePromise = loadStripe(
  "pk_test_51Iwqe0KvZqrt4tRI0ZewUir13YIgFCeoaO9AQQb2w6a1Lu8AnWN2TypvEg4Q24xXXM8rL0BChZEjaIdx5FOYgVqQ0081tq7z3V"
);
export default function StripeElements({
  children,
  clientSecret,
}: PropsWithChildren<{ clientSecret: string }>) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
}

export function StripeCheckoutForm({
  form,
}: {
  form: UseFormReturn<any, any>;
}) {
  return <PaymentElement />;
}
