import { AccordionItem } from "@/components/Accordion";
import StandardButton from "@/components/StandardButton";
import Image from "next/image";

export function ItemOrder({ game }: { game: any }) {
  return (
    <div className="grid grid-cols-[65%_auto] grid-rows-[minmax(0px,auto)_auto] gap-8">
      {/* <div className="col-start-1 row-start-1"> */}
      {/*   <h1 className="relative text-2xl w-1/2 py-4 border-b-4 border-primary"> */}
      {/*     Checkout */}
      {/*   </h1> */}
      {/* </div> */}
      <div className="col-start-1 row-start-1">
        <h2 className="uppercase mb-4 text-xl">Payment methods</h2>
        <div className="">
          <div className="rounded overflow-hidden">
            <AccordionItem />
            <hr className="border-white/25" />
            <div className="bg-paper_2">
              <h3
                className="text-lg relative
                after:bg-white/[0.10] after:absolute after:inset-0 
                after:opacity-0 hover:after:opacity-100 after:transition-opacity"
                data-component={"collapsibles"}
                aria-expanded={false}
              >
                <button className="flex justify-between items-center w-full py-4 px-6 ">
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <img
                        width="34"
                        height="34"
                        src="https://img.icons8.com/external-justicon-flat-justicon/64/external-paypal-social-media-justicon-flat-justicon.png"
                        alt="external-paypal-social-media-justicon-flat-justicon"
                      />

                      {/* <img */}
                      {/*   width="34" */}
                      {/*   height="94" */}
                      {/*   src="https://img.icons8.com/3d-fluency/94/paypal-app.png" */}
                      {/*   alt="paypal-app" */}
                      {/* /> */}
                    </div>
                    <span>Paypal</span>
                  </div>
                  <svg fill="transparent" stroke="white" width={24} height={24}>
                    <use xlinkHref="/svg/sprites/actions.svg#chevron-down" />
                  </svg>
                </button>
              </h3>
              <div className="hidden" arira-hidden={true}>
                Stripe contetn
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-start-2 row-start-1">
        <h2 className="uppercase text-lg mb-4">Order summary</h2>
        <div className={"flex flex-col gap-4"}>
          <div className="flex items-center gap-4 ">
            <div className="relative w-32 aspect-[9/13] rounded overflow-hidden">
              <Image
                src={
                  game.images.find((img: any) => {
                    return img.type === "portrait";
                  })?.url
                }
                alt={""}
                fill
              />
            </div>
            <div>
              <p className="font-bold text-white_primary">{game.name}</p>
              <p className="text-white_primary/60 text-sm">{game.developer}</p>
            </div>
          </div>
          <div>
            <div className={"text-sm"}>
              <div className="flex justify-between">
                <p>Price</p>
                <p>${game.sale_price}</p>
              </div>
              <div hidden className="flex justify-between">
                <p>Sale Discount</p>
                <p>${game.sale_price}</p>
              </div>
            </div>
            <hr className="border-white/60 my-4" />
            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold">{game.sale_price}</p>
            </div>
          </div>
          <div className={'mt-4'}>
            <StandardButton>Place order</StandardButton>
          </div>
        </div>
      </div>
    </div>
  );
}
