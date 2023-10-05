import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/utils";
import { findUserByStripeId } from "@/database/repository/user/select";
import { updateOrder } from "@/database/repository/order/update";

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig as string,
      "whsec_26b2190125022e254ac977ae3eb50a7462e44dcf655952c64c3120bf54853434",
    );
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
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object as any;
      const customer = paymentIntentSucceeded.customer;
      const customerId = typeof customer === "string" ? customer : customer?.id;
      if (customerId) {
        const user = await findUserByStripeId({ id: customerId });
        await updateOrder({
          order: {
            status: "succeeded",
            card_type:
              paymentIntentSucceeded.charges.data[0].payment_method_details.card
                .last4,
          },
        });
      }
      return NextResponse.json({
        status: 200,
        message: "Payment succeeded",
      });
    default:
      return NextResponse.json({
        status: 200,
        event,
      });
  }
}
