"use server";

import { stripe } from "@/utils";
import { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";

type CreateOrderArgs = Parameters<
  Required<PayPalButtonsComponentProps>["createOrder"]
>;

type OnApproveArgs = Parameters<
  Required<PayPalButtonsComponentProps>["onApprove"]
>;

const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com",
};

const CLIENT_ID =
  "AbaGVeBEzwXYtkr7JS5eV8nsX8F-iUyRqMur8AbCiCy4DCn0i_5ZdbrzyvN1SrxfpqoIY30uR4_BLJxK";
const SECRET =
  "EGBTdC6d-mfAMuJGrhlvk9RobwgEC_twf3kfwCbpjR8GM0rESFPCN9Mk5hGFav1n266xk0upg828MiFd";

async function generateAccessToken() {
  return await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + SECRET).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  }).then((res) => res.json());
}

type TokenPayload = {
  access_token: string;
  app_id: string;
  expires_in: number;
  nonce: string;
  scope: string;
  token_type: string;
};
export async function createOrder(dataStr: string) {
  const { amount }: { amount: string } = JSON.parse(dataStr);

  const tokenPayload: TokenPayload = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders`;
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
        },
      ],
    }),
  })
    .then((res) => res.json())
    .then((order) => order.id);
}

export async function onApprove(data: OnApproveArgs[0], _: OnApproveArgs[1]) {
  const tokenPayload: TokenPayload = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${data.orderID}/capture`;
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
  }).then((res) => res.json());
}

export const removePaymentMethod = async (id: string) => {
  await stripe.paymentMethods.detach(id);
};

export async function serverMap<T extends any[], G extends unknown>(
  array: T,
  callback: (value: T[number], index: number, array: T[]) => G,
) {
  return array.map(callback);
}

export async function serverEvery<T extends any[]>(
  array: T,
  callback: (value: T[number], index: number, array: T[]) => any,
) {
  return array.every(callback);
}

export async function serverSome<T extends any[]>(
  array: T,
  callback: (value: T[number], index: number, array: T[]) => any,
) {
  return array.some(callback);
}

export async function serverFind<T extends any[]>(
  array: T,
  callback: (value: T[number], index: number, obj: any[]) => T[number] | undefined,
): Promise<T[number] | undefined> {
  return array.find(callback);
}
