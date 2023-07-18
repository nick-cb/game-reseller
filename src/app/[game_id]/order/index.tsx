"use client";

import PaymentMethods from "@/components/PaymentMethods";
import StandardButton from "@/components/StandardButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PaymentMethodFormPayload = {
  type: "card" | "paypal";
};

export function ItemOrder({
  game,
  stripeSecret,
}: {
  game: any;
  stripeSecret?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<PaymentMethodFormPayload>({
    mode: "onSubmit",
    resolver: zodResolver(
      z.object({
        type: z.string().nonempty(),
      })
    ),
  });
  const { handleSubmit } = form;

  const onSubmit = async () => {
    const cardElement = elements?.getElement(CardElement);
    if (!cardElement) {
      return;
    }
    const paymentMethod = await stripe!.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (!paymentMethod.paymentMethod) {
      return;
    }
    const payload = await stripe!.confirmCardPayment(stripeSecret, {
      payment_method: paymentMethod.paymentMethod!.id,
    });
    if (payload.error) {
      return;
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log("RUN");
      }}
      className="grid grid-cols-[65%_auto] grid-rows-[minmax(0px,auto)_auto] gap-8"
    >
      {/* <div className="col-start-1 row-start-1"> */}
      {/*   <h1 className="relative text-2xl w-1/2 py-4 border-b-4 border-primary"> */}
      {/*     Checkout */}
      {/*   </h1> */}
      {/* </div> */}
      <div className="col-start-1 row-start-1">
        <h2 className="uppercase mb-4 text-xl">Payment methods</h2>
        <PaymentMethods stripeSecret={stripeSecret} form={form} />
      </div>
      <div className="col-start-2 row-start-1">
        <h2 className="uppercase text-lg mb-4">Order summary</h2>
        <div className={"flex flex-col gap-4"}>
          <div className="flex items-center gap-4 ">
            <div className="relative w-32 aspect-[9/13] rounded overflow-hidden">
              <Image
                src={
                  game.images.find((img: any) => {
                    return img.type === "portrait";
                  })?.url
                }
                alt={""}
                fill
              />
            </div>
            <div>
              <p className="font-bold text-white_primary">{game.name}</p>
              <p className="text-white_primary/60 text-sm">{game.developer}</p>
            </div>
          </div>
          <div>
            <div className={"text-sm"}>
              <div className="flex justify-between">
                <p>Price</p>
                <p>${game.sale_price}</p>
              </div>
              <div hidden className="flex justify-between">
                <p>Sale Discount</p>
                <p>${game.sale_price}</p>
              </div>
            </div>
            <hr className="border-white/60 my-4" />
            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold">{game.sale_price}</p>
            </div>
          </div>
          <div className={"mt-4"}>
            <StandardButton disabled={false}>Place order</StandardButton>
          </div>
        </div>
      </div>
    </form>
  );
}
