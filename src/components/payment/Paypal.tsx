"use client";

import { createOrder, onApprove } from "@/actions/payments/paypal";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export function Paypal() {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AbaGVeBEzwXYtkr7JS5eV8nsX8F-iUyRqMur8AbCiCy4DCn0i_5ZdbrzyvN1SrxfpqoIY30uR4_BLJxK",
        debug: true,
      }}
    >
      <PayPalButtons
        fundingSource="paypal"
        createOrder={async () => {
          return await createOrder(JSON.stringify({ amount: 100 }));
        }}
        onApprove={async (...args) => {
          await onApprove(...args);
        }}
      />
    </PayPalScriptProvider>
  );
}
