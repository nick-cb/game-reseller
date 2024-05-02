import { PropsWithChildren, createContext, useState } from "react";
import Stripe from "stripe";

type PaymentMethodProps = {
  paymentMethods: Pick<Stripe.PaymentMethod, "id">[];
  removePaymentMethod: (method: { id: string }) => void;
};
const paymentMethodContext = createContext<PaymentMethodProps>({
  paymentMethods: [],
  removePaymentMethod: () => {},
});

export function PaymentMethodContext({
  paymentMethods,
  children,
}: PropsWithChildren<{
  paymentMethods: PaymentMethodProps["paymentMethods"];
}>) {
  const [_paymentMethods, setPaymentMethods] = useState(paymentMethods);
  const removePaymentMethod = ({ id }: { id: string }) => {
    setPaymentMethods([
      ..._paymentMethods.filter((payment) => payment.id !== id),
    ]);
  };

  return (
    <paymentMethodContext.Provider
      value={{ paymentMethods, removePaymentMethod }}
    >
      {children}
    </paymentMethodContext.Provider>
  );
}
