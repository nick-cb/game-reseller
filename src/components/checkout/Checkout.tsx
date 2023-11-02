import { createOrder } from "@/actions/order";
import { decodeToken, findUserById, updateUserById } from "@/actions/users";
import {
  PaymentTabButton,
  SpriteIcon,
  SavePayment,
} from "@/components/payment/PaymentRadioTab";
import {
  StripeCheckoutForm,
  StripeElementsNullish,
} from "@/components/payment/Stripe";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/utils";
import { deleteCart } from "@/actions/cart";
import { serverFind, serverMap } from "@/actions/payments/paypal";
import {
  CreateOrderPayload,
  Game,
  GameImageGroup,
  Orders,
} from "@/database/models";
import {
  Accordion,
  AccordionBody,
  AccordionGroup,
  AccordionHeader,
} from "@/components/Accordion";
import { MobileGameList } from "@/components/checkout/MobileGameList";
import { PaymentItem } from "@/components/checkout/SavedCardItem";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SnackContextProvider } from "@/components/SnackContext";
import Stripe from "stripe";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PlaceOrderButton } from "../game/PlaceOrderButton";
import { Scroll, ScrollItem } from "@/components/scroll/index";

export async function CheckoutView({
  gameList,
  cartId,
}: {
  gameList: (Pick<
    Game,
    "ID" | "name" | "type" | "developer" | "publisher" | "sale_price" | "slug"
  > & {
    checked: boolean;
    images: GameImageGroup;
  })[];
  cartId?: number;
}) {
  const cookie = cookies().get("refresh_token");
  if (!cookie) {
    redirect("/");
  }
  const payload = decodeToken(cookie.value);
  if (typeof payload === "string") {
    redirect("/");
  }
  const [{ data: user }] = await Promise.all([
    findUserById({ id: payload.userId }),
  ]);

  if (!user) {
    redirect("/");
  }

  const paymentMethodRes = user.stripe_id
    ? await stripe.customers.listPaymentMethods(user.stripe_id, {
        type: "card",
      })
    : null;
  const paymentMethods = paymentMethodRes?.data || [];

  let amount = 0;
  for (const game of gameList.filter((game) => game.checked)) {
    amount += parseFloat(game.sale_price.toString());
  }

  const placeOrder = async (order: Partial<CreateOrderPayload>) => {
    "use server";
    const { data: user } = await findUserById({ id: payload.userId });
    if (!user) {
      throw new Error("User not found");
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
      order: {
        amount,
        payment_method: "card",
        payment_service: "stripe",
        items: JSON.stringify(items),
        user_id: user.ID,
        created_at: order.created_at || dayjs().format("YYYY-MM-DD HH:mm:ss"),
        status: order.status || "pending",
        ...order,
      },
    });

    const {
      data: { insertId },
    } = response

    return insertId;
  };

  const dedupePaymentMethod = async (
    newPaymentMethod: Stripe.PaymentMethod,
  ) => {
    "use server";
    const { fingerprint: newFingerprint } = newPaymentMethod.card || {};
    const existPaymentMethod = await serverFind(paymentMethods, (method) => {
      const { fingerprint: oldFigerprint } = method.card || {};
      if (
        !!oldFigerprint &&
        !!newFingerprint &&
        newFingerprint === oldFigerprint
      ) {
        return method;
      }
      return undefined;
    });
    return existPaymentMethod || newPaymentMethod || undefined;
  };

  const payWithStripe = async ({
    paymentMethod,
    save,
  }: {
    paymentMethod: string;
    save: boolean;
  }) => {
    "use server";
    try {
      if (!paymentMethod) {
        return { error: "Please provide a valid payment method" };
      }

      if (!user.stripe_id) {
        const newCustomer = await stripe.customers.create({
          name: user.full_name || "",
        });
        user.stripe_id = newCustomer.id;
        await updateUserById(payload.userId, {
          user: {
            stripe_id: newCustomer.id,
          },
        });
      }

      const newPaymentMethod =
        await stripe.paymentMethods.retrieve(paymentMethod);

      const dedupedMethod = await dedupePaymentMethod(newPaymentMethod);
      const { brand, last4 } = dedupedMethod.card || {};

      const paymentIntent = await stripe.paymentIntents.create({
        confirm: true,
        amount: amount,
        currency: "vnd",
        customer: user.stripe_id,
        payment_method: dedupedMethod?.id || newPaymentMethod.id,
        // return_url: "http://localhost:3000/order/success",
        use_stripe_sdk: true,
        ...(save ? { setup_future_usage: "off_session" } : {}),
        // mandate_data: {
        //   customer_acceptance: {
        //     type: "online",
        //     online: {
        //       ip_address: req.ip,
        //       user_agent: req.get("user-agent"),
        //     },
        //   },
        // }
      });
      const orderId = await placeOrder({
        payment_intent: paymentIntent!.id,
        created_at: dayjs(paymentIntent?.created).format("YYYY-MM-DD HH:mm:ss"),
        status: ["canceled", "succeeded"].includes(paymentIntent.status)
          ? (paymentIntent.status as Orders["status"])
          : "pending",
        card_type: brand || undefined,
        card_number: last4 || undefined,
        canceled_at: paymentIntent.canceled_at
          ? dayjs(paymentIntent.canceled_at).format("YYYY-MM-DD HH:mm:ss")
          : undefined,
      });
      console.log({orderId, cartId});
      if (cartId) {
        const {error} = await deleteCart(cartId);
        console.log({error});
      }

      return {
        orderId,
        clientSecret: paymentIntent.client_secret!,
        status: paymentIntent.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "",
      };
    }
  };

  return (
    <SnackContextProvider>
      <StripeElementsNullish amount={amount} currency={"vnd"}>
        <CheckoutForm
          payWithStripe={payWithStripe}
          className={
            "flex flex-col grid-cols-[calc(70%-32px)_30%] md:grid gap-8"
          }
          style={{
            gridTemplateRows: `repeat(${
              4 + paymentMethods.length
            },min-content)`,
          }}
        >
          <MobileGameList gameList={gameList} />
          <AccordionGroup
            exclusive
            defaultValue={paymentMethods.length > 0 ? 0 : 1}
          >
            {!!paymentMethods.length ? (
              <div
                className="col-start-1 col-end-2"
                style={{
                  gridRow: `1 / span ${paymentMethods.length}`,
                }}
              >
                <Accordion index={0}>
                  <AccordionHeader className="px-3 h-max py-4 border-b border-white_primary/25 rounded-t bg-paper">
                    Your payment methods
                  </AccordionHeader>
                  <AccordionBody
                    remountChild
                    className="px-3 pb-4 rounded-b bg-paper"
                  >
                    <ul className="flex flex-col gap-2 ">
                      {paymentMethods.map((payment) => {
                        return (
                          <PaymentItem key={payment.id} payment={payment} />
                        );
                      })}
                    </ul>
                  </AccordionBody>
                </Accordion>
              </div>
            ) : null}
            {amount >= 0.5 ? (
              <Accordion index={1}>
                <div
                  className="col-start-1 rounded bg-paper h-max"
                  style={{
                    gridRow: `${paymentMethods.length + 1} / -1`,
                  }}
                >
                  {!!paymentMethods.length ? (
                    <AccordionHeader className="px-3 h-max py-4 border-b border-white_primary/25 rounded-t bg-paper">
                      Other payment methods
                    </AccordionHeader>
                  ) : (
                    <h3 className="uppercase mb-4 text-xl">Payment methods</h3>
                  )}
                  <AccordionBody
                    remountChild
                    className="px-3 py-4 pb-4 rounded-b bg-paper"
                  >
                    <Scroll containerSelector={"#payment-method-group"}>
                      <ul
                        className={
                          "flex gap-4 3/4sm:gap-8 " + " snap-x snap-mandatory "
                        }
                      >
                        <PaymentTabButton method="stripe" index={0}>
                          <SpriteIcon
                            stroke="white"
                            fill="white"
                            sprite={"actions"}
                            id={"card"}
                          />
                          Card
                        </PaymentTabButton>
                        <PaymentTabButton method="paypal" index={1}>
                          <SpriteIcon
                            fill="none"
                            stroke="white"
                            sprite={"actions"}
                            id={"paypal"}
                          />
                          Paypal
                        </PaymentTabButton>
                      </ul>
                      <br />
                      <ul
                        id="payment-method-group"
                        className={
                          "flex w-[calc(100%+16px)] h-full rounded gap-8 px-2 -translate-x-2 " +
                          " overflow-x-scroll scrollbar-hidden overflow-y-hidden " +
                          " snap-x snap-mandatory "
                        }
                      >
                        <ScrollItem
                          as="li"
                          className={"w-full shrink-0 snap-center stripe-card"}
                        >
                          <StripeCheckoutForm />
                          <hr className="border-default my-2" />
                          <SavePayment id="card" />
                        </ScrollItem>
                        <ScrollItem
                          as="li"
                          className="w-full shrink-0 snap-center"
                        >
                          <p className="text-[14.88px]">
                            You will be directed to PayPal to authorize your
                            payment method, then you will be returned to Penguin
                            Games to complete this purchase.
                          </p>
                          <hr className="my-4 border-default" />
                          <SavePayment id="paypal" />
                        </ScrollItem>
                      </ul>
                    </Scroll>
                  </AccordionBody>
                </div>
              </Accordion>
            ) : null}
          </AccordionGroup>
          <div id="checkout-button" className={"md:col-start-2"}>
            <PlaceOrderButton>Place order</PlaceOrderButton>
          </div>
          <div
            className="hidden md:block col-start-2 row-start-1"
            style={{
              gridRow: `1 / span ${1 + paymentMethods.length}`,
            }}
          >
            <OrderSummary totalAmount={amount} gameList={gameList} />
          </div>
        </CheckoutForm>
      </StripeElementsNullish>
    </SnackContextProvider>
  );
}
