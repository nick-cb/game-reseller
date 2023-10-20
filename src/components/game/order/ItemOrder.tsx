import { RadioGroup } from "@/components/Radio";
import Scroll, { Item } from "@/components/Scroll";
import { SnackContextProvider } from "@/components/SnackContext";
import { PlaceOrderButton } from "@/components/game/PlaceOrderButton";
import {
  PaymentTabButton,
  SavePayment,
  SpriteIcon,
} from "@/components/payment/PaymentRadioTab";
import StripeElements, {
  StripeCheckoutForm,
} from "@/components/payment/Stripe";
import { Game, GameImageGroup } from "@/database/models";
import { currencyFormatter } from "@/utils";
import Image from "next/image";

export function ItemOrder({
  game,
  clientSecret,
  placeOrder: rememberPayment,
}: {
  game: Pick<Game, "ID" | "name" | "developer" | "sale_price"> & {
    images: GameImageGroup;
  };
  clientSecret: string;
  placeOrder: (payment: {
    type: "stripe" | "paypal";
    save: boolean;
  }) => Promise<any>;
}) {
  return (
    <>
      <Scroll containerSelector={"#payment-method-group"}>
        <StripeElements clientSecret={clientSecret}>
          <RadioGroup toggleAble>
            <div className={"col-start-2 row-start-2"}>
              <SnackContextProvider>
                <PlaceOrderButton placeOrder={rememberPayment} />
              </SnackContextProvider>
            </div>
            <div className="col-start-1">
              <h2 className="uppercase mb-4 text-xl">Payment methods</h2>
              <ul
                className={
                  "flex gap-4 3/4sm:gap-8 " + " snap-x snap-mandatory "
                }
              >
                <PaymentTabButton index={0}>
                  <SpriteIcon
                    stroke="white"
                    fill="white"
                    sprite={"actions"}
                    id={"card"}
                  />
                  Card
                </PaymentTabButton>
                <PaymentTabButton index={1}>
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
                <Item
                  as="li"
                  className={"w-full shrink-0 snap-center stripe-card"}
                >
                  <StripeCheckoutForm />
                  <hr className="border-default my-2" />
                  <SavePayment id="card" />
                </Item>
                <Item as="li" className="w-full shrink-0 snap-center">
                  <p className="text-[14.88px]">
                    You will be directed to PayPal to authorize your payment
                    method, then you will be returned to Penguin Games to
                    complete this purchase.
                  </p>
                  <hr className="my-4 border-default" />
                  <SavePayment id="paypal" />
                </Item>
              </ul>
            </div>
          </RadioGroup>
        </StripeElements>
      </Scroll>
      <div className="hidden md:block">
        <h2 className="uppercase text-lg mb-4">Order summary</h2>
        <div className={"flex flex-col gap-4"}>
          <div className="flex items-center gap-4 ">
            <div
              className={
                " relative w-32 aspect-[9/13] rounded overflow-hidden " +
                " bg-white_primary/25 "
              }
            >
              <Image src={game?.images.portrait?.url} alt={""} fill />
            </div>
            <div>
              <p className="font-bold text-white_primary">{game.name}</p>
              <p className="text-white_primary/60 text-sm">{game.developer}</p>
            </div>
          </div>
          <div>
            <div className={"text-sm flex flex-col gap-2"}>
              <div className="flex justify-between">
                <p>Price</p>
                <p>{currencyFormatter(game.sale_price)}</p>
              </div>
              <div hidden className="flex justify-between">
                <p>Sale Discount</p>
                <p>{currencyFormatter(0)}</p>
              </div>
            </div>
            <hr className="border-white/60 my-4" />
            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold">{currencyFormatter(game.sale_price)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <h2 className="uppercase text-lg mb-4">Order summary</h2>
        <div className={"w-full bg-paper_2 rounded px-3 py-2 flex gap-4 "}>
          <Image
            src={game?.images.portrait?.url}
            alt={""}
            width={50}
            height={70}
            className="rounded"
          />
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-white_primary text-sm">{game.name}</p>
              <p className="text-white_primary/60 text-xs">{game.developer}</p>
            </div>
            <p>{currencyFormatter(game.sale_price)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
