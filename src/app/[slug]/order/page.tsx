import { findGameBySlug } from "@/actions/game/select";
import { groupImages } from "@/utils/data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeToken } from "@/actions/users";
import { CheckoutView } from "@/components/checkout/Checkout";

export type ExchangeRate = {
  date: string;
  usd: string;
};
export default async function ItemOrderPage({ params }: { params: any }) {
  const { slug } = params;
  const { data } = await findGameBySlug(slug.replace("(.)", ""));
  const cookie = cookies().get("refresh_token");
  if (!cookie) {
    redirect("/");
  }
  const payload = decodeToken(cookie.value);
  if (typeof payload === "string") {
    redirect("/");
  }

  if (!data) {
    redirect("/");
  }

  const game = { ...data, images: groupImages(data.images), checked: true };

  return (
    <div className="flex flex-col-reverse grid-cols-[calc(70%-32px)_30%] md:grid md:grid-rows-[minmax(0px,auto)_min-content] gap-8">
      <CheckoutView gameList={[game]} />
    </div>
  );
}
