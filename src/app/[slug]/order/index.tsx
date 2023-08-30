"use client";

import PaymentMethods from "@/components/PaymentMethods";
import StandardButton from "@/components/StandardButton";
import { AnimatedIcon } from "@/components/icons/animated";
import {
  PaymentTabButton,
  SavePayment,
  SpriteIcon,
} from "@/components/payment/PaymentRadioTab";
import { Paypal } from "@/components/payment/Paypal";
import StripeElements, {
  StripeCheckoutForm,
} from "@/components/payment/Stripe";
import Stripe from "@/components/payment/Stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PaymentMethodFormPayload = {
  type: "card" | "paypal";
};

export function ItemOrder({
  game,
  clientSecret,
}: {
  game: any;
  clientSecret: string;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [outOfView, setOutOfView] = useState<boolean>(false);
  const [method, setMethod] = useState(0);
  const radioButtonGroupRef = useRef<HTMLUListElement>(null);
  const radioContentGroupRef = useRef<HTMLUListElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const radioButtonGroup = radioButtonGroupRef.current;
    const radioContentGroup = radioContentGroupRef.current;
    if (!radioButtonGroup || !radioContentGroup) {
      return;
    }

    const radioContentItems = radioContentGroup.children;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLLIElement;
          const index = parseInt(target.dataset["index"] || "");
          const widthIntersectionRatio =
            entry.intersectionRect.width / entry.rootBounds!.width;
          const floorAspectRatio = Math.floor(widthIntersectionRatio * 10) / 10;
          if (isNaN(index)) {
            continue;
          }
          if (floorAspectRatio === 1) {
            continue;
          }
          if (floorAspectRatio >= 0.5 && floorAspectRatio < 0.9) {
            setMethod(index);
          }
        }
      },
      {
        root: radioContentGroup,
        threshold: [0.5],
      }
    );

    for (const item of radioContentItems) {
      observer.observe(item);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log({ entries });
        if (entries[0].intersectionRatio === 0) {
          setOutOfView(true);
        } else {
          setOutOfView(false);
        }
      },
      { threshold: [0] }
    );
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
  }, []);

  const tabButtonOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const index = parseInt(e.currentTarget.dataset["index"] || "");
    if (isNaN(index)) {
      return;
    }
    if (radioContentGroupRef.current) {
      radioContentGroupRef.current.scroll({
        left: radioContentGroupRef.current.clientWidth * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      // onSubmit={(event) => {
      //   event.preventDefault();
      //   console.log("RUN");
      // }}
      className="flex flex-col-reverse md:grid md:grid-rows-[minmax(0px,auto)_min-content] gap-8"
    >
      {/* <div className="col-start-1 row-start-1"> */}
      {/*   <h1 className="relative text-2xl w-1/2 py-4 border-b-4 border-primary"> */}
      {/*     Checkout */}
      {/*   </h1> */}
      {/* </div> */}
      <div className={"col-start-2 row-start-2"}>
        <StandardButton
          disabled={false}
          className={
            "h-14 relative " +
            "before:absolute before:inset-0 before:bg-[rgb(255,_196,_57)] " +
            " before:rounded hover:!brightness-90 before:transition-[width] " +
            " before:w-0 " +
            (method === 1 ? " before:w-full " : "") +
            " before:duration-200 "
          }
        >
          <AnimatedIcon.Paypal show={method === 1} />
          <span
            className={
              "relative transition-colors delay-[25ms] duration-[175ms] " +
              (method === 1 ? " text-default " : "")
            }
          >
            Place order
          </span>
        </StandardButton>
      </div>
      <div className="col-start-1 row-span-full">
        <h2 className="uppercase mb-4 text-xl">Payment methods</h2>
        <ul
          ref={radioButtonGroupRef}
          className={"flex gap-4 3/4sm:gap-8 " + " snap-x snap-mandatory "}
        >
          {/* <div */}
          {/*   style={{ inlineSize: "28px" }} */}
          {/*   className="xs-right-pad:hidden" */}
          {/* ></div> */}
          <PaymentTabButton
            active={method === 0}
            data-index={0}
            onClick={tabButtonOnClick}
          >
            <SpriteIcon
              stroke="white"
              fill="white"
              sprite={"actions"}
              id={"card"}
            />
            Card
          </PaymentTabButton>
          <PaymentTabButton
            active={method === 1}
            data-index={1}
            onClick={tabButtonOnClick}
          >
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
          ref={radioContentGroupRef}
          className={
            "flex w-[calc(100%+16px)] h-full rounded gap-8 px-2 -translate-x-2 " +
            " overflow-x-scroll scrollbar-hidden overflow-y-hidden " +
            " snap-x snap-mandatory "
          }
        >
          <li
            data-index={0}
            className={"w-full shrink-0 snap-center stripe-card"}
          >
            <StripeElements clientSecret={clientSecret}>
              <StripeCheckoutForm />
            </StripeElements>
            <hr className="border-default my-2" />
            <SavePayment id="card" />
          </li>
          <li data-index={1} className="w-full shrink-0 snap-center">
            <p className="text-[14.88px]">
              You will be directed to PayPal to authorize your payment method,
              then you will be returned to Penguin Games to complete this
              purchase.
            </p>
            <hr className="my-4 border-default" />
            <SavePayment id="paypal" />
          </li>
        </ul>
      </div>
      <div ref={rightColRef} className="hidden md:block">
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
              <p className="font-bold text-white_primary">{game?.name}</p>
              <p className="text-white_primary/60 text-sm">{game?.developer}</p>
            </div>
          </div>
          <div>
            <div className={"text-sm"}>
              <div className="flex justify-between">
                <p>Price</p>
                <p>${game?.sale_price}</p>
              </div>
              <div hidden className="flex justify-between">
                <p>Sale Discount</p>
                <p>${game?.sale_price}</p>
              </div>
            </div>
            <hr className="border-white/60 my-4" />
            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold">{game?.sale_price}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="uppercase text-lg mb-4">Order summary</h2>
        <div
          className={"w-full bg-paper_2 rounded px-3 py-2 flex gap-4 "}
          ref={itemRef}
        >
          <Image
            src={game?.images.portrait?.url}
            alt={""}
            width={50}
            height={70}
            className="rounded"
          />
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-white_primary text-sm">{game?.name}</p>
              <p className="text-white_primary/60 text-xs">{game?.developer}</p>
            </div>
            <p>{game?.sale_price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
