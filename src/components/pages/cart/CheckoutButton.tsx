"use client";

import { Button } from "@/components/Buttons";
import { useCartContext } from "./CartContext";

export function CheckoutButton() {
  const { updating } = useCartContext();
  return (
    <Button disabled={updating} className="mt-8 w-full">
      Go to checkout
    </Button>
  );
}
