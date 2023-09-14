import StripeElements from "@/components/payment/Stripe";
import { ItemOrder } from ".";
import Stripe from "stripe";
import data from "@/data/collections.json";

export default async function ItemOrderPage({ params }: { params: any }) {
  const { slug } = params;
  const game = data[0].list_game.find((g) => g.slug === slug);
  // const data = await fetch(
  //   `http://localhost:5001/api/products/games/${gameId.replace("(.)", "")}`
  // ).then((res) => res.json());
  const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || "", {
    apiVersion: "2022-11-15",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: (game?.sale_price || 1) * 100,
    currency: "USD",
    payment_method_types: ["card"],
  });
  return <ItemOrder game={game} clientSecret={paymentIntent.client_secret!} />;
  // return (
  //   <StripeElements clientSecret={paymentIntent.client_secret!}>
  //     <ItemOrder game={data} />
  //   </StripeElements>
  // );
}
