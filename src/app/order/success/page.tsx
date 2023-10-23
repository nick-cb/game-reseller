import { findOrderById } from "@/actions/order";
import { getUserFromCookie } from "@/actions/users";
import { OrderItemDistribute } from "@/components/OrderItemDistribute";
import { randomInt } from "crypto";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const id = parseInt(searchParams["order_id"]);
  const payload = await getUserFromCookie();
  if (!payload) {
    redirect("/");
  }
  const { data: order } = isNaN(id)
    ? { data: null }
    : await findOrderById(id, {
        userId: payload.userId,
      });
  if (!order) {
    return <div>Order not found</div>;
  }
  const items = order.items;
  const firstItem = items[0];

  return (
    <div
      id="game-grid"
      className="h-full grid"
      style={{
        gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
        gridTemplateRows: "repeat(auto-fill,minmax(200px,1fr))",
      }}
    >
      <div
        className={
          "flex flex-col items-center pt-2 " +
          "bg-paper rounded shadow-black/25 shadow " +
          "w-[600px] pb-10 place-self-center absolute"
        }
      >
        <Image
          src={"/you-rock.gif"}
          alt={"You rock"}
          width={400}
          height={200}
          className="mx-auto"
        />
        <br />
        <h2 className="text-xl mb-2">Thank you for your order!</h2>
        <p className="text-white_primary/60">
          You can find your order{" "}
          <Link
            href={"/account/orders/" + id}
            className="underline hover:text-white_primary transition-colors"
          >
            here
          </Link>
        </p>
        {items.length === 1
          ? (() => {
              const shadowColor = firstItem.images.portrait.colors.highestSat;
              return (
                <Image
                  src={firstItem.images.portrait.url}
                  width={150}
                  height={200}
                  alt={firstItem.name}
                  title={firstItem.name}
                  className={
                    "rounded absolute right-10 translate-x-1/2 -rotate-[30deg] -translate-y-1/2 top-10 " +
                    "[--tw-shadow-colored:0_10px_25px_-3px_var(--tw-shadow-color),_0_-2px_10px_0px_var(--tw-shadow-color),_0_4px_6px_-4px_var(--tw-shadow-color)] "
                  }
                  style={{
                    boxShadow: `var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 10px 25px -3px rgb(${shadowColor}), 0 -2px 10px 0px rgb(${shadowColor}), 0 4px 6px -4px rgb(${shadowColor})`,
                  }}
                />
              );
            })()
          : null}
      </div>
      {items.length > 1 ? <OrderItemDistribute gameList={items} /> : null}
    </div>
  );
}
