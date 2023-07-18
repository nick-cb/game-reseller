import StripeElements from "@/components/payment/Stripe";
import { ItemOrder } from ".";
import Stripe from "stripe";

export default async function ItemOrderPage({ params }: { params: any }) {
  const { game_id: gameId } = params;
  const data = await fetch(
    `http://localhost:5001/api/products/games/${gameId.replace("(.)", "")}`
  ).then((res) => res.json());
  const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || "", {
    apiVersion: "2022-11-15",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.sale_price * 100,
    currency: "USD",
  });

  return (
    <StripeElements clientSecret={paymentIntent.client_secret!}>
      <ItemOrder game={data} />
    </StripeElements>
  );
}
