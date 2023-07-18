"use client";

import { useCallback, useState } from "react";
import { useController, UseFormReturn } from "react-hook-form";
import {
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  AccordionSeparator,
} from "./Accordion";
import { StripeCheckoutForm } from "./payment/Stripe";
import StripeLogo from "./StripeLogo";

export default function PaymentMethods({
  stripeSecret,
  form,
}: {
  stripeSecret: string | undefined;
  form: UseFormReturn<any, any>;
}) {
  const {
    field: { onChange, value: type },
  } = useController({ control: form.control, name: "type" });

  const onClickMethod = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const _type = event.currentTarget.dataset["type"];
      onChange(type === _type ? null : _type);
    },
    [onChange, type]
  );

  return (
    <div className="rounded">
      <AccordionItem expanded={type === "card"}>
        <AccordionHeader
          data-type={"card"}
          onClick={onClickMethod}
          type={"button"}
        >
          <StripeLogo className="bg-[#635bff] w-14 px-1 py-[2px] rounded" />
          <span>Stripe</span>
        </AccordionHeader>
        <AccordionBody className={"px-6 py-4"}>
          <StripeCheckoutForm form={form} />
        </AccordionBody>
      </AccordionItem>
      <AccordionSeparator expanded={type === "card"} />
      <div className="bg-paper_2">
        <h3
          className="text-lg relative
          after:bg-white/[0.10] after:absolute after:inset-0 
          after:opacity-0 hover:after:opacity-100 after:transition-opacity"
          data-component={"collapsibles"}
          aria-expanded={false}
        >
          <button className="flex justify-between items-center w-full py-4 px-6 ">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <img
                  width="34"
                  height="34"
                  src="https://img.icons8.com/external-justicon-flat-justicon/64/external-paypal-social-media-justicon-flat-justicon.png"
                  alt="external-paypal-social-media-justicon-flat-justicon"
                />

                {/* <img */}
                {/*   width="34" */}
                {/*   height="94" */}
                {/*   src="https://img.icons8.com/3d-fluency/94/paypal-app.png" */}
                {/*   alt="paypal-app" */}
                {/* /> */}
              </div>
              <span>Paypal</span>
            </div>
            <svg fill="transparent" stroke="white" width={24} height={24}>
              <use xlinkHref="/svg/sprites/actions.svg#chevron-down" />
            </svg>
          </button>
        </h3>
        <div className="hidden" arira-hidden={true}>
          Stripe content
        </div>
      </div>
    </div>
  );
}
