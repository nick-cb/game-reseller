import CheckoutActions from '@/actions2/checkout-actions';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

export async function Paypal() {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'AbaGVeBEzwXYtkr7JS5eV8nsX8F-iUyRqMur8AbCiCy4DCn0i_5ZdbrzyvN1SrxfpqoIY30uR4_BLJxK',
        debug: true,
      }}
    >
      <PayPalButtons
        fundingSource="paypal"
        createOrder={await CheckoutActions.orders.payWithPaypal({ amount: 1000 })}
        onApprove={CheckoutActions.orders.approvePaypalOrder}
      />
    </PayPalScriptProvider>
  );
}
