import { decodeToken } from "@/actions/users";
import ItemOrderModal from "@/components/game/OrderModal";
import { findGameBySlug } from "@/actions/game/select";
import { groupImages } from "@/utils/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckoutView } from "@/components/checkout/Checkout";

export default async function ItemOrderModalPage({ params }: { params: any }) {
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
    <ItemOrderModal>
      <CheckoutView gameList={[game]} />
    </ItemOrderModal>
  );
}
