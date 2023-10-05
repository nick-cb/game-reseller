"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useScroll } from "../Scroll";
import StandardButton from "../StandardButton";
import { AnimatedIcon } from "../icons/animated";
import { useRadio } from "../Radio";
import { SnackContext } from "../SnackContext";
import { useContext } from "react";

export function PlaceOrderButton({
  rememberPayment,
}: {
  rememberPayment: (
    payment: { type: "stripe" } | { type: "paypal" },
  ) => Promise<any>;
}) {
  const stripe = useStripe();
  const element = useElements();
  const { elements } = useScroll();
  const { selected } = useRadio();
  const { showMessage } = useContext(SnackContext);
  const method = elements.findIndex((el) => el.isIntersecting);

  return (
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
      onClick={async (event) => {
        event.preventDefault();
        if (!stripe || !element) {
          return;
        }

        try {
          if (selected?.includes("yes")) {
            await rememberPayment({
              type: "stripe",
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          const { error } = await stripe.confirmPayment({
            elements: element,
            confirmParams: {
              return_url: "http://localhost:3000/",
            },
          });

          if (error) {
            showMessage({ message: "Something happened", type: "error" });
          }
        }
      }}
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
  );
}
