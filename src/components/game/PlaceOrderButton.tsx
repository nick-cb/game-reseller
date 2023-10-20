"use client";

import { useScroll } from "../Scroll";
import StandardButton from "../StandardButton";
import { AnimatedIcon } from "../icons/animated";
import { useRadio } from "../Radio";
import { SnackContext } from "../SnackContext";
import { useContext, useRef, useTransition } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Stripe from "stripe";
import { Dialog } from "../Dialog";
import { useRouter } from "next/navigation";
import { updateOrder } from "@/actions/orders";

export function PlaceOrderButton({
  payWithStripe,
}: {
  payWithStripe: (payload: { paymentMethod: string; save: boolean }) => Promise<
    | {
        error: string;
      }
    | {
        orderId: number;
        clientSecret: string;
        status: Stripe.PaymentIntent.Status;
      }
  >;
}) {
  const stripe = useStripe();
  const element = useElements();
  const { elements } = useScroll();
  const { selected } = useRadio();
  const { showMessage } = useContext(SnackContext);
  const method = elements.findIndex((el) => el.isIntersecting);
  const ref = useRef<HTMLDialogElement>(null);
  const [processing, startProcessing] = useTransition();
  const router = useRouter();

  return (
    <StandardButton
      disabled={processing}
      loading={processing}
      type="submit"
      onClick={async (event) => {
        event.preventDefault();
        if (!stripe || !element) {
          return;
        }
        const observer = new MutationObserver((mutationList) => {
          for (const mutation of mutationList) {
            const addedNode = mutation.addedNodes.item(0);
            const iframeNode = addedNode?.childNodes.item(0);
            if (addedNode && iframeNode instanceof HTMLIFrameElement) {
              ref.current?.appendChild(iframeNode);
              ref.current?.showModal();
            }
          }
        });
        observer.observe(document.body, {
          childList: true,
        });

        startProcessing(async () => {
          try {
            const { error: elementError } = await element.submit();
            if (elementError && elementError?.message) {
              throw new Error(elementError.message);
            }
            const { paymentMethod, error: createPaymentError } =
              await stripe.createPaymentMethod({
                elements: element,
              });
            if (createPaymentError && createPaymentError.message) {
              throw new Error(createPaymentError.message);
            }
            if (!paymentMethod) {
              throw new Error("Invalid payment method");
            }
            const response =
              (await payWithStripe({
                save: selected?.includes("yes") ? true : false,
                paymentMethod: paymentMethod?.id,
              })) || {};
            if ("error" in response) {
              throw new Error(response.error);
            }
            const { clientSecret, status, orderId } = response;
            if (clientSecret && status === "requires_action") {
              const { error, paymentIntent } = await stripe.handleNextAction({
                clientSecret,
              });
              if (
                paymentIntent?.id &&
                paymentIntent.status !== "requires_action"
              ) {
                await updateOrder(orderId, {
                  order: { status: paymentIntent.status },
                });
              }
              const nextActionModal = ref.current;
              if (!nextActionModal) {
                return;
              }
              if (error?.message) {
                throw new Error(error.message);
              }
              nextActionModal.close();
              observer.disconnect();
              return router.push("/order/completed?order_id=" + orderId);
            }
          } catch (error) {
            if (error instanceof Error) {
              showMessage({ message: error.message, type: "error" });
            }
          }
        });
      }}
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
      <Dialog
        ref={ref}
        className="h-full w-full !bg-transparent backdrop-filter-none !shadow-none"
      ></Dialog>
    </StandardButton>
  );
}
