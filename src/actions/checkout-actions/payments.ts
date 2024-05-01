'use server';

import {Game, GameImageGroup, Users} from '@/database/models/model';
import {stripe} from '@/utils';
import {PayPalButtonsComponentProps} from '@paypal/react-paypal-js';
import Stripe from 'stripe';
import * as Q from './queries';
import CartActions from '../cart-actions';
import UserActions from '../users-actions';
import OrderActions from '../order-actions';

export type PayWithStripeClientPayload = {
  paymentMethod: string;
  save: boolean;
};
export type PayWithStripeParams = {
  cartId: number;
  paymentMethods: Stripe.PaymentMethod[];
  user: Pick<Users, 'ID' | 'full_name' | 'stripe_id'>;
  amount: number;
  gameList: (Pick<
    Game,
    'ID' | 'name' | 'type' | 'developer' | 'publisher' | 'sale_price' | 'slug'
  > & { images: GameImageGroup; checked: boolean })[];
};
export type UpsertChoosenPaymentMethodParams = {
  user: Pick<Users, 'ID' | 'full_name' | 'stripe_id'>;
  paymentMethod: string;
  paymentMethods: Stripe.PaymentMethod[];
};

export async function upsertChoosenPaymentMethod(params: UpsertChoosenPaymentMethodParams) {
  const {user, paymentMethod, paymentMethods} = params;
  let stripeId = user.stripe_id;
  if (!stripeId) {
    const newCustomer = await stripe.customers.create({
      name: user.full_name || '',
    });
    stripeId = newCustomer.id;
    const {error} = await UserActions.users.updateUserByID(user.ID, {
      user: {stripe_id: stripeId},
    });
  }

  const newPaymentMethod = await stripe.paymentMethods.retrieve(paymentMethod);
  const dedupedMethod = await dedupePaymentMethod({newPaymentMethod, paymentMethods});

  return dedupedMethod;
}

export type DedupePaymentMethodParams = {
  newPaymentMethod: Stripe.PaymentMethod;
  paymentMethods: Stripe.PaymentMethod[];
};

export async function dedupePaymentMethod(params: DedupePaymentMethodParams) {
  const {newPaymentMethod, paymentMethods} = params;
  const {fingerprint: newFingerprint} = newPaymentMethod.card || {};
  const existPaymentMethod = paymentMethods.find((method) => {
    const {fingerprint: oldFingerprint} = method.card || {};
    if (!!oldFingerprint && !!newFingerprint && newFingerprint === oldFingerprint) {
      return method;
    }
    return undefined;
  });
  return existPaymentMethod || newPaymentMethod || undefined;
}

export async function payWithStripe(params: PayWithStripeParams) {
  const { cartId, paymentMethods, user, amount, gameList } = params;
  return async (payload: PayWithStripeClientPayload) => {
    'use server';
    const { paymentMethod, save } = payload;
    if (!paymentMethod) {
      return { error: 'Invalid payment method' };
    }
    const { id, card, customer } = await upsertChoosenPaymentMethod({
      paymentMethods,
      paymentMethod,
      user,
    });

    const { brand, last4 } = card || {};
    const paymentIntent = await stripe.paymentIntents.create({
      confirm: true,
      amount: amount,
      currency: 'vnd',
      customer: customer as string,
      payment_method: id,
      use_stripe_sdk: true,
      ...(save ? { setup_future_usage: 'off_session' } : {}),
    });
    const { data, error } = await OrderActions.orders.createOrder({
      order: {
        items: gameList,
        amount: amount,
        status: 'processing',
        user_id: user.ID,
        card_type: brand,
        card_number: last4,
        payment_method: 'credit_card',
        payment_service: 'stripe',
        payment_intent: paymentIntent.id,
      },
    });
    if (error) {
      // TODO: Handle error
    }

    await CartActions.carts.deleteCartByID(cartId);

    return {
      orderID: data.ID,
      clientSecret: paymentIntent.client_secret!,
      status: paymentIntent.status,
    };
  };
}

const SANDBOX_URL = 'https://api-m.sandbox.paypal.com';
const PRODUCTION_URL = 'https://api-m.paypal.com';
const CLIENT_ID =
  'AbaGVeBEzwXYtkr7JS5eV8nsX8F-iUyRqMur8AbCiCy4DCn0i_5ZdbrzyvN1SrxfpqoIY30uR4_BLJxK';
const SECRET = 'EGBTdC6d-mfAMuJGrhlvk9RobwgEC_twf3kfwCbpjR8GM0rESFPCN9Mk5hGFav1n266xk0upg828MiFd';
type PayWithPaypalParams = {
  amount: number;
};
export async function payWithPaypal(params: PayWithPaypalParams) {
  return async () => {
    const { amount } = params;
    const token = await generateAccessToken();
    const url = `${baseUrl()}/v2/checkout/orders`;
    const orderRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
            },
          },
        ],
      }),
    });
    const order = await orderRes.json();
    return order.id as string;
  };
}
function baseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_URL;
  }

  return SANDBOX_URL;
}
type TokenPayload = {
  access_token: string;
  app_id: string;
  expires_in: number;
  nonce: string;
  scope: string;
  token_type: string;
};
async function generateAccessToken() {
  const url = `${baseUrl()}/v2/oauth2/token`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + SECRET).toString('base64'),
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });
  return (await response.json()) as TokenPayload;
}
type OnApproveArgs = Parameters<Required<PayPalButtonsComponentProps>['onApprove']>;
export async function approvePaypalOrder(data: OnApproveArgs[0], _: OnApproveArgs[1]) {
  const token = await generateAccessToken();
  const url = `${baseUrl()}/v2/checkout/orders/${data.orderID}/capture`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  return await response.json();
}

export async function updateOrderPaymentIntent(orderID: number, paymentIntent: string) {
  try {
    const { data } = await Q.updateOrderPaymentIntent(orderID, paymentIntent);
  } catch (error) {}
}

export async function removePaymentMethod(id: string) {
  await stripe.paymentMethods.detach(id);
}
