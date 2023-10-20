"use server";

import { stripe } from "@/utils";

export const removePaymentMethod = async (id: string) => {
    "use server";
    await stripe.paymentMethods.detach(id);
};

