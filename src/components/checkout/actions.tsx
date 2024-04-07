'use server';

import { createOrder } from '@/actions/order';
import { serverFind, serverMap } from '@/actions/payments/paypal';
import { findUserById, updateUserById } from '@/actions/users';
import { CreateOrderPayload, Users } from '@/database/models';
import { stripe } from '@/utils';
import dayjs from 'dayjs';
import Stripe from 'stripe';
import { CheckoutViewProps } from './Checkout';

export type GetPaymentMethodParams = {
  user: Users;
  paymentMethod: string;
  paymentMethods: Stripe.PaymentMethod[];
};
export async function getPaymentMethod(params: GetPaymentMethodParams) {
  const { user, paymentMethod, paymentMethods } = params;
  let stripeId = user.stripe_id;
  if (!stripeId) {
    const newCustomer = await stripe.customers.create({
      name: user.full_name || '',
    });
    stripeId = newCustomer.id;
    await updateUserById(user.ID, { user: { stripe_id: newCustomer.id } });
  }

  const newPaymentMethod = await stripe.paymentMethods.retrieve(paymentMethod);
  const dedupedMethod = await dedupePaymentMethod({ newPaymentMethod, paymentMethods });
  return dedupedMethod || {};
}
type DedupePaymentMethodParams = {
  newPaymentMethod: Stripe.PaymentMethod;
  paymentMethods: Stripe.PaymentMethod[];
};
const dedupePaymentMethod = async (params: DedupePaymentMethodParams) => {
  'use server';
  const { newPaymentMethod, paymentMethods } = params;
  const { fingerprint: newFingerprint } = newPaymentMethod.card || {};
  const existPaymentMethod = await serverFind(paymentMethods, (method) => {
    const { fingerprint: oldFigerprint } = method.card || {};
    if (!!oldFigerprint && !!newFingerprint && newFingerprint === oldFigerprint) {
      return method;
    }
    return undefined;
  });
  return existPaymentMethod || newPaymentMethod || undefined;
};

type PlaceOrderParams = {
  order: Partial<CreateOrderPayload>;
  userId: number;
  gameList: CheckoutViewProps['gameList'];
};
export const placeOrder = async (params: PlaceOrderParams) => {
  'use server';
  const { order, userId, gameList } = params;
  const { data: user } = await findUserById({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  const items = await serverMap(gameList, (game) => {
    return {
      ID: game.ID,
      name: game.name,
      type: game.type,
      developer: game.developer,
      publisher: game.publisher,
      sale_price: game.sale_price,
      discounts: [],
      discount_price: game.sale_price,
      slug: game.slug,
      base_game_id: null,
      images: {
        portrait: game.images.portrait,
      },
    };
  });

  const response = await createOrder({
    // @ts-ignore
    order: {
      payment_method: 'card',
      payment_service: 'stripe',
      items: JSON.stringify(items),
      user_id: user.ID,
      created_at: order.created_at || dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: order.status || 'pending',
      ...order,
    },
  });

  const {
    data: { insertId },
  } = response;

  return insertId;
};
