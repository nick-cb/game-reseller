import { ItemOrder } from ".";
import Stripe from "stripe";
import { findGameBySlug } from "@/database/repository/game/select";
import { groupImages } from "@/utils/data";
import { redirect } from "next/navigation";

type ExchangeRate = {
  date: string;
  usd: string;
};
export default async function ItemOrderPage({ params }: { params: any }) {
  const { slug } = params;
  const { data } = await findGameBySlug(slug.replace("(.)", ""));

  if (!data) {
    redirect("/");
  }

  const game = { ...data, images: groupImages(data.images) };
  const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || "", {
    apiVersion: "2022-11-15",
  });
  const rate: ExchangeRate = await fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/vnd/usd.json",
  ).then((res) => res.json());

  const paymentIntent = await stripe.paymentIntents.create({
    amount:
      (Math.round((game?.sale_price || 1) * parseFloat(rate.usd) * 100) / 100) *
      100,
    currency: "USD",
    payment_method_types: ["card"],
  });

  return <ItemOrder game={game} clientSecret={paymentIntent.client_secret!} />;
}
