import { findOrderById } from "@/actions/order";
import { getUserFromCookie } from "@/actions/users";
import { OrderItemDistribute } from "@/components/OrderItemDistribute";
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
      className="h-full flex justify-center items-center pt-[200px]"
      // style={{
      //   gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
      //   gridTemplateRows: "repeat(auto-fill,minmax(200px,1fr))",
      // }}
    >
      <div className={"flex gap-8"}>
        {/* <ul className="w-[300px] h-[450px] relative"> */}
        {/*   {items.map((item, index) => { */}
        {/*     const image = item.images.portrait; */}
        {/*     const shadowColor = image.colors.highestSat; */}
        {/*     return ( */}
        {/*       <li */}
        {/*         className={ */}
        {/*           "absolute hover:-translate-y-1/3 transition-transform duration-300 ease-out " + */}
        {/*           "flex items-center w-full " */}
        {/*         } */}
        {/*         style={{ */}
        {/*           bottom: index * (450 / items.length) * -1 + "px", */}
        {/*           // transform: `translateY(${index * (450 / items.length)}px)`, */}
        {/*         }} */}
        {/*       > */}
        {/*         <div */}
        {/*           className="absolute -top-3 left-1/2 -translate-x-1/2 w-[90%] h-1/2 blur-md opacity-60 z-[-1]" */}
        {/*           style={{ */}
        {/*             background: `linear-gradient(0deg, #000 0%, transparent 100%)`, */}
        {/*             // background: `rgb(${shadowColor})`, */}
        {/*           }} */}
        {/*         ></div> */}
        {/*         <Image */}
        {/*           src={item.images.portrait.url} */}
        {/*           alt={""} */}
        {/*           width={300} */}
        {/*           height={450} */}
        {/*           className="object-cover w-[300px] h-[450px] rounded-xl shadow-black mx-auto" */}
        {/*           style={{ */}
        {/*             width: 300 - (items.length - index) * 5 + "px", */}
        {/*             boxShadow: `var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 10px 25px -3px rgb(${shadowColor}), 0 -2px 10px 0px rgb(${shadowColor}), 0 4px 6px -4px rgb(${shadowColor})`, */}
        {/*           }} */}
        {/*         /> */}
        {/*       </li> */}
        {/*     ); */}
        {/*   })} */}
        {/* </ul> */}
        <div
          className={
            "flex flex-col items-center pt-2 " +
            "w-[600px] pb-10 " +
            "bg-paper rounded shadow-black/25 shadow relative "
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
              href={"/"}
              className="underline hover:text-white_primary transition-colors"
            >
              here
            </Link>
          </p>
          {items.length === 1 ? (
            (() => {
              const shadowColor = firstItem.images.portraits.colors.highestSat;
              return (
                <Image
                  src={firstItem.images.portraits.url}
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
          ) : (
            <OrderItemDistribute gameList={items} />
          )}
        </div>
      </div>
    </div>
  );
}
