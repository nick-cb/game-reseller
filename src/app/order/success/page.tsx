import { currencyFormatter, pascalCase } from "@/utils";
import Image from "next/image";
import {findOrderByIntent} from "@/actions/order";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { data: order } = await findOrderByIntent(
    searchParams["payment_intent"],
  );
  if (!order) {
    return <div>Order not found</div>;
  }
  let totalPrice = 0;
  for (const item of order.items) {
    totalPrice += item.sale_price;
  }

  return (
    <div className="w-full">
      <Image
        src={"/you-rock.gif"}
        alt={"You rock"}
        width={400}
        height={200}
        className="mx-auto"
      />
      <br />
      <div className="flex gap-8">
        <div className="w-[70%]">
          <ul>
            {order.items.map((item) => {
              return (
                <li className="bg-paper_2 rounded-md px-4 py-4 flex gap-8">
                  <Image
                    src={item.images.portrait.url || ""}
                    alt={""}
                    width={150}
                    height={250}
                    className="rounded-md"
                  />
                  <div className="flex-grow flex flex-col">
                    <div className="text-xs px-2 py-1 rounded w-max bg-white_primary/[.15]">
                      {pascalCase(item.type, "_")}
                    </div>
                    <div className="flex justify-between mt-4">
                      <p className="font-bold block">{item.name}</p>
                      <p className="block text-sm">
                        {currencyFormatter(item.sale_price)}
                      </p>
                    </div>
                    <p className="text-sm text-white_primary/60">
                      {item.developer}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-[30%]">
          <div className="flex flex-col gap-8">
            <div className="bg-paper_2 rounded-md px-4 py-4">
              {order.payment_service === "stripe" ? (
                <div className="text-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p>
                      Paid by {order.card_type} {order.payment_method}
                    </p>
                    <p>{order.card_number}</p>
                  </div>
                  <p className="text-green-400 text-xs italic">
                    Payment{" "}
                    {order.status === "succeeded" ? "succeeded" : "failed"}
                  </p>
                  <div className="flex justify-between items-center">
                    <p>Card number</p>
                    <p>•••• •••• •••• {order.card_number}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <div>
              <div className={"text-sm flex flex-col gap-2"}>
                <div className="flex justify-between">
                  <p>Price</p>
                  <p>{currencyFormatter(totalPrice)}</p>
                </div>
                <div hidden className="flex justify-between">
                  <p>Sale Discount</p>
                  <p>{currencyFormatter(0)}</p>
                </div>
              </div>
              <hr className="border-white/60 my-4" />
              <div className="flex justify-between text-sm">
                <p className="font-bold">Total</p>
                <p className="font-bold">{currencyFormatter(totalPrice)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
