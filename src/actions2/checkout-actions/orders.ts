'use server';

import { Game, GameImageGroup, Users } from '@/database/models/model';
import { stripe } from '@/utils';
import Stripe from 'stripe';
import ShareActions from '../share';
import * as Q from './queries';

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
export async function payWithStripe(params: PayWithStripeParams) {
  const { cartId, paymentMethods, user, amount, gameList } = params;
  return async (payload: PayWithStripeClientPayload) => {
    'use server';
    const { paymentMethod, save } = payload;
    if (!paymentMethod) {
      return { error: 'Invalid payment method' };
    }
    const { id, card, customer } = await ShareActions.payments.upsertChoosenPaymentMethod({
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
    const { data, error } = await ShareActions.orders.createOrder({
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

    await ShareActions.carts.deleteCartByID(cartId);

    return {
      orderID: data.ID,
      clientSecret: paymentIntent.client_secret!,
      status: paymentIntent.status,
    };
  };
}

export async function updateOrderPaymentIntent(orderID: number, paymentIntent: string) {
  try {
    const { data } = await Q.updateOrderPaymentIntent(orderID, paymentIntent);
  } catch (error) {}
}
