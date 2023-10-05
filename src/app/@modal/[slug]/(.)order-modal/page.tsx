import { decodeToken } from "@/actions/users";
import { ExchangeRate } from "@/app/[slug]/order/page";
import ItemOrderModal from "@/components/game/OrderModal";
import { ItemOrder } from "@/components/game/order/ItemOrder";
import { findGameBySlug } from "@/database/repository/game/select";
import { findUserById } from "@/database/repository/user/select";
import { updateUserById } from "@/database/repository/user/update";
import { stripe } from "@/utils";
import { groupImages } from "@/utils/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const paymentIntent = await stripe.paymentIntents.create({
    amount:
      (Math.round((game?.sale_price || 1) * parseFloat(rate.usd) * 100) / 100) *
      100,
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
      const updatedPaymentIntent = await stripe.paymentIntents.update(
        paymentIntent.id,
        {
          customer: stripeId!,
          receipt_email: user.email,
        },
      );
      return updatedPaymentIntent.id;
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
