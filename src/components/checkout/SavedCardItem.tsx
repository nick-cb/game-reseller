import Stripe from "stripe";
import { HookFormRadio } from "../Radio";
import { RemoveCardBtn } from "./RemoveCardBtn";

export function PaymentItem({ payment }: { payment: Stripe.PaymentMethod }) {
  return (
    <li
      key={payment.id}
      className="rounded bg-paper py-4 flex items-center gap-4"
    >
      <HookFormRadio
        name={"method_id"}
        value={payment.id}
        id={payment.id}
        className="w-5 h-5"
      />
      <svg fill="none" stroke="none" width={36} height={22.91}>
        <use
          width={36}
          height={22.91}
          xlinkHref={"/svg/sprites/card-brands.svg#" + payment.card?.brand}
        />
      </svg>
      <p className="text-sm">
        {payment.card?.brand.toUpperCase()} - {payment.card?.last4}
      </p>
      <RemoveCardBtn
        paymentMethod={{ id: payment.id }}
        className="ml-auto hover:bg-white_primary/[.15] rounded-full px-1 py-1 transition-colors"
      >
        <svg stroke="white" height={24} width={24}>
          <use
            xlinkHref="/svg/sprites/actions.svg#trash-can"
            height={24}
            width={24}
          />
        </svg>
      </RemoveCardBtn>
    </li>
  );
}
