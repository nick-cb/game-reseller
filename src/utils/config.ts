export const COOKIES_OPTIONS = {
  path: "/",
  // domain: "http://localhost:3001/",
  httpOnly: true,
  secure: false,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY!) * 1000,
  sameSite: true,
};

export const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "";

export const LandscapeImages = [
  "landscape",
  "carousel",
  "OfferImageWide",
  "DieselStoreFrontWide",
];
export const PortraitImages = [
  "portrait",
  "thumbnail",
  "tall",
  "OfferImageTall",
  "DieselStoreFrontTall",
];
