"use client";

import StandardButton from "../../StandardButton";
import { useCartContext } from "./CartContext";

export function CheckoutButton() {
  const { updating } = useCartContext();
  return (
    <StandardButton disabled={updating} className="mt-8">
      Go to checkout
    </StandardButton>
  );
}
