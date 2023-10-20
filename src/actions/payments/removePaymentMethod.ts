"use server";

export const removePaymentMethod = async (id: string) => {
    "use server";
    await stripe.paymentMethods.detach(id);
};

