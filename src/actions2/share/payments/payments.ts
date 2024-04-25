'use server';

import { Users } from '@/database/models/model';
import { stripe } from '@/utils';
import Stripe from 'stripe';
import ShareActions from '..';
import { serverFind } from '@/actions/payments/paypal';

type UpsertChoosenPaymentMethodParams = {
  user: Pick<Users, 'ID' | 'full_name' | 'stripe_id'>;
  paymentMethod: string;
  paymentMethods: Stripe.PaymentMethod[];
};
export async function upsertChoosenPaymentMethod(params: UpsertChoosenPaymentMethodParams) {
  const { user, paymentMethod, paymentMethods } = params;
  let stripeId = user.stripe_id;
  if (!stripeId) {
    const newCustomer = await stripe.customers.create({
      name: user.full_name || '',
    });
    stripeId = newCustomer.id;
    const { error } = await ShareActions.users.updateUserByID(user.ID, {
      user: { stripe_id: stripeId },
    });
  }

  const newPaymentMethod = await stripe.paymentMethods.retrieve(paymentMethod);
  const dedupedMethod = await dedupePaymentMethod({ newPaymentMethod, paymentMethods });

  return dedupedMethod;
}

type DedupePaymentMethodParams = {
  newPaymentMethod: Stripe.PaymentMethod;
  paymentMethods: Stripe.PaymentMethod[];
};
export async function dedupePaymentMethod(params: DedupePaymentMethodParams) {
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
}
