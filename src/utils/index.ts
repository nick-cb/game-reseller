import { ReactElement, JSXElementConstructor } from 'react';
import Stripe from 'stripe';
import { global } from 'styled-jsx/css';
import util from 'util';

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
  if (navigateEvent.navigationType === 'push' || navigateEvent.navigationType === 'replace') {
    return false;
  }
  if ('navigation' in window === false) {
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
  window.navigation.addEventListener('navigate', (event: any) => {
    const toUrl = new URL(event.destination.url);
    if (location.origin !== toUrl.origin) return;
    const fromPath = location.pathname;
    const isBack = isBackNavigation(event);

    event.intercept({
      async handler() {
        if (event.info === 'ignore') return;

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
  const segments = type.split(delimiter).filter((segment) => !!segment);
  let final = '';
  for (const segment of segments) {
    final += ' ';
    final += segment[0].toUpperCase() + segment.substring(1);
  }
  return final.trim();
};

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function renderComponentToString(
  component: ReactElement<any, string | JSXElementConstructor<any>>
) {
  const ReactDOMServer = (await import('react-dom/server')).default;
  // @ts-ignore
  return ReactDOMServer.renderToString(component);
}

export const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || '', {
  apiVersion: '2022-11-15',
});

const CURRENCY = {
  VND: {
    locale: 'vi-VN',
    options: {
      style: 'currency',
      currency: 'VND',
    },
  },
  USD: {
    locale: 'en-US',
    options: {
      style: 'currency',
      currency: 'USD',
    },
  },
} as const;

type CurrentcyFormatterOptions = {
  currency: 'VND' | 'USD';
};
export function currencyFormatter(num: number, options?: CurrentcyFormatterOptions) {
  const { currency = 'VND' } = options || {};
  return Intl.NumberFormat(CURRENCY[currency].locale, CURRENCY[currency].options).format(num);
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

export function isNil(a: any): a is null | undefined {
  return a === undefined || a === null;
}

export function mergeCls(...args: any[]) {
  let cls = args[0] && typeof args[0] === 'string' ? args[0] : '';
  for (const cl of args.splice(1)) {
    if (!cl) {
      continue;
    }
    cls = cls.concat(' ' + cl);
  }
  return cls.trim();
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

const priority = {
  low: 3,
  medium: 2,
  high: 1,
  audio: 0,
};
export function getVideoSources(video: FindVideoArrayResult[number]) {
  return video.recipes
    .filter(({ recipe }) => !recipe?.includes('hls'))
    .map(({ variants }) => {
      const sortedVariants = variants.sort((a, b) => priority[b.media_key] - priority[a.media_key]);
      return sortedVariants[0];
    });
}
export function getAudioSourcesFromVideo(video: FindVideoArrayResult[number]) {
  return video.recipes
    .filter(({ recipe }) => !recipe?.includes('hls'))
    .map(({ variants }) => {
      const variant = variants.find(({ media_key }) => media_key === 'audio');
      return variant;
    });
}

function logDebug(value: any, options = { envs: ['development'] }) {
  if (options.envs.includes(process.env.NODE_ENV || 'development') === false) {
    return;
  }
  console.log(util.inspect(value, { showHidden: false, depth: null, colors: true }));
}

export const ImageGroups = {
  PORTRAIT: ['portrait'],
  LOGO: ['logo', 'ProductLogo'],
};

export const DefaultPagination = {
  limit: 24,
  skip: 0,
};

declare global {
  /**
   * console.log with util.inspect
   */
  function logDebug(value: any): void;
}
const __global = (typeof window !== 'undefined' ? window : global) as any;
__global.logDebug = logDebug;
