import { ReactElement, JSXElementConstructor } from "react";
import Stripe from "stripe";

export async function getPageContent(url: any) {
  // This is a really scrappy way to do this.
  // Don't do this in production!
  const response = await fetch(url);
  const text = await response.text();
  // Particularly as it uses regexp
  //@ts-ignore
  return /<body[^>]*>([\w\W]*)<\/body>/.exec(text)[1];
}

function isBackNavigation(navigateEvent: any) {
  if (
    navigateEvent.navigationType === "push" ||
    navigateEvent.navigationType === "replace"
  ) {
    return false;
  }
  if (
    navigateEvent.destination.index !== -1 &&
    //@ts-ignore
    navigateEvent.destination.index < window.navigation.currentEntry.index
  ) {
    return true;
  }
  return false;
}

export async function onLinkNavigate(callback: Function) {
  //@ts-ignore
  window.navigation.addEventListener("navigate", (event: any) => {
    const toUrl = new URL(event.destination.url);
    if (location.origin !== toUrl.origin) return;
    const fromPath = location.pathname;
    const isBack = isBackNavigation(event);

    event.intercept({
      async handler() {
        if (event.info === "ignore") return;

        await callback({
          toPath: toUrl.pathname,
          fromPath,
          isBack,
        });
      },
    });
  });
}

export const pascalCase = (type: string, delimiter: string) => {
  const segments = type.split(delimiter);
  let final = "";
  for (const segment of segments) {
    final += " ";
    final += segment[0].toUpperCase() + segment.substring(1);
  }
  return final.trim();
};

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function renderComponentToString(
  component: ReactElement<any, string | JSXElementConstructor<any>>,
) {
  const ReactDOMServer = (await import("react-dom/server")).default;
  return ReactDOMServer.renderToString(component);
}

export const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || "", {
  apiVersion: "2022-11-15",
});

const CURRENCY = {
  VND: {
    locale: "vi-VN",
    options: {
      style: "currency",
      currency: "VND",
    },
  },
  USD: {
    locale: "en-US",
    options: {
      style: "currency",
      currency: "USD",
    },
  },
};

export function currencyFormatter(
  num: number,
  { currency }: { currency: "VND" | "USD" } = {
    currency: "VND",
  },
) {
  return Intl.NumberFormat(
    CURRENCY[currency].locale,
    CURRENCY[currency].options,
  ).format(num);
}

export function fromUnixTime(unixTime: number) {
  const date = new Date(unixTime * 1000);
  return date;
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}
