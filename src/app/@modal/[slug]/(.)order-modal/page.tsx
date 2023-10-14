import {decodeToken, findUserById, updateUserById} from "@/actions/users";
import { ExchangeRate } from "@/app/[slug]/order/page";
import ItemOrderModal from "@/components/game/OrderModal";
import { ItemOrder } from "@/components/game/order/ItemOrder";
import { findGameBySlug } from "@/actions/game/select";
import { stripe } from "@/utils";
import { groupImages } from "@/utils/data";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {createOrder} from "@/actions/order";

export default async function ItemOrderModalPage({ params }: { params: any }) {
  const { slug } = params;
  const { data } = await findGameBySlug(slug.replace("(.)", ""));
  const cookie = cookies().get("refresh_token");
  if (!cookie) {
    redirect("/");
  }
  const payload = decodeToken(cookie.value);
  if (typeof payload === "string") {
    redirect("/");
  }

  if (!data) {
    redirect("/");
  }

  const game = { ...data, images: groupImages(data.images) };
  const rate: ExchangeRate = await fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/vnd/usd.json",
  ).then((res) => res.json());

  const amount =
    Math.round((game?.sale_price || 1) * parseFloat(rate.usd) * 100) / 100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "USD",
    payment_method_types: ["card"],
    description: data.name,
  });

  const rememberPayment = async (
    payment: { type: "stripe" } | { type: "paypal" },
  ) => {
    "use server";

    const { data: user } = await findUserById({ id: payload.userId });
    let stripeId = user.stripe_id;
    if (!user.stripe_id) {
      const newCustomer = await stripe.customers.create({
        name: user.name,
      });
      stripeId = newCustomer.id;
      await updateUserById(payload.userId, {
        user: {
          stripe_id: stripeId,
        },
      });
    }

    if (payment.type === "stripe") {
      await stripe.paymentIntents.update(paymentIntent.id, {
        customer: stripeId!,
        setup_future_usage: "off_session",
      });
      await createOrder({
        order: {
          payment_intent: paymentIntent.id,
          amount,
          payment_method: "card",
          payment_service: "stripe",
          created_at: dayjs(paymentIntent.created).format(
            "YYYY-MM-DD HH:mm:ss",
          ),
          items: JSON.stringify([
            {
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
            },
          ]),
          status: "pending",
          user_id: user.ID,
          card_number: null,
          card_type: null,
          canceled_at: null,
          succeeded_at: null,
        },
      });
    }
  };

  return (
    <ItemOrderModal game={game}>
      <ItemOrder
        game={game}
        clientSecret={paymentIntent.client_secret!}
        rememberPayment={rememberPayment}
      />
    </ItemOrderModal>
  );
}
