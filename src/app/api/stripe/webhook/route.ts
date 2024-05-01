import { NextResponse } from 'next/server';
import { stripe } from '@/utils';
import ShareActions from '@/actions/share';

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({
      status: 500,
    });
  }
  try {
    event = stripe.webhooks.constructEvent(payload, sig as string, secret);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({
        status: 400,
        message: `Webhook Error: ${error.message}`,
      });
    }
  }
  if (!event) {
    return NextResponse.json({
      status: 400,
    });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntentSucceeded = event.data.object as any;
      const customer = paymentIntentSucceeded.customer;
      const customerId = typeof customer === 'string' ? customer : customer?.id;
      if (customerId) {
        const card = paymentIntentSucceeded.charges.data[0].payment_method_details.card;
        console.log({ id: paymentIntentSucceeded.id });
        await ShareActions.orders.updateOrderByPaymentIntent(paymentIntentSucceeded.id, {
          order: {
            status: paymentIntentSucceeded.status,
            card_type: card.brand,
            card_number: card.last4,
            canceled_at: paymentIntentSucceeded.canceled_at,
          },
        });
      }
      return NextResponse.json({
        status: 200,
        message: 'Payment succeeded',
      });
    }
    case 'payment_intent.canceled': {
      const paymentIntentCanceled = event.data.object as any;
      const customer = paymentIntentCanceled.customer;
      const customerId = typeof customer === 'string' ? customer : customer?.id;
      if (customerId) {
        const card = paymentIntentCanceled.charges.data[0]?.payment_method_details?.card;
        await ShareActions.orders.updateOrderByPaymentIntent(paymentIntentCanceled.id, {
          order: {
            status: paymentIntentCanceled.status,
            card_type: card?.brand || null,
            card_number: card?.last4 || null,
            canceled_at: paymentIntentCanceled.canceled_at,
          },
        });
      }
      return NextResponse.json({
        status: 200,
        message: 'Payment succeeded',
      });
    }
    case 'payment_intent.payment_failed': {
      const paymentIntentPaymentFailed = event.data.object as any;
      const customer = paymentIntentPaymentFailed.customer;
      const customerId = typeof customer === 'string' ? customer : customer?.id;
      if (customerId) {
        const card = paymentIntentPaymentFailed.charges.data[0]?.payment_method_details?.card;
        await ShareActions.orders.updateOrderByPaymentIntent(paymentIntentPaymentFailed.id, {
          order: {
            status: paymentIntentPaymentFailed.status,
            card_type: card?.brand || null,
            card_number: card?.last4 || null,
            canceled_at: paymentIntentPaymentFailed.canceled_at,
          },
        });
      }
      return NextResponse.json({
        status: 200,
        message: 'Payment succeeded',
      });
    }
    default:
      return NextResponse.json({
        status: 200,
        event,
      });
  }
}
