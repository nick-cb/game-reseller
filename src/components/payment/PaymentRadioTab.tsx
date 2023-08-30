import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
  PropsWithChildren,
  SVGProps,
} from "react";

export function PaymentTabButton({
  // icon,
  children,
  className,
  type,
  active,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { active: boolean }) {
  return (
    <li
      className={
        " 3/4sm:w-28 3/4sm:h-24 rounded-md border-2 border-solid snap-start " +
        " w-24 h-20 " +
        " transition-colors hover:bg-white/25 " +
        " gap-2 " +
        (active ? " border-primary " : " border-white/25 ")
      }
    >
      <label className={"text-sm w-full h-full block"}>
        <button
          type={type || "button"}
          className={
            "w-full h-full " +
            " flex flex-col justify-center items-center " +
            className
          }
          {...props}
        >
          {children}
          {/* <svg width={32} height={32} className="mb-2 mx-auto"> */}
          {/*   <use stroke="white" fill="white" xlinkHref={icon} /> */}
          {/* </svg> */}
          {/* {name} */}
        </button>
      </label>
    </li>
  );
}

export function SpriteIcon({
  sprite,
  id,
  ...props
}: { sprite: string; id: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={32} height={32} className="mb-2 mx-auto" {...props}>
      <use xlinkHref={`/svg/sprites/${sprite}.svg#${id}`} />
    </svg>
  );
}

export function CheckMarkSvg() {
  return (
    <svg
      id="checkmark"
      viewBox="0 0 32 32"
      fill="none"
      stroke="white"
      width={24}
      height={24}
      className={
        "absolute inset-0 z-10 -left-[2px] -top-[2px] pointer-events-none"
      }
    >
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-miterlimit="4"
        stroke-width="2"
        d="M22.867 26.267c-1.933 1.333-4.333 2.067-6.867 2.067-6.8 0-12.333-5.533-12.333-12.333 0-2.933 1.067-5.667 2.733-7.8"
        className="svg-elem-1"
      ></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-miterlimit="4"
        stroke-width="2"
        d="M13.4 3.933c0.867-0.2 1.733-0.267 2.6-0.267 6.8 0 12.333 5.533 12.333 12.333 0 1.933-0.467 3.733-1.2 5.333"
        className="svg-elem-2"
      ></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-miterlimit="4"
        stroke-width="2"
        d="M11 16.333l3.333 3.333 6.667-6.667"
        className="svg-elem-3"
      ></path>
    </svg>
  );
}

export function SavePayment({ id }: { id: string }) {
  return (
    <>
      <p className="text-[14.88px] mb-2 ">
        Save this payment method for future purchases
      </p>
      <div className="flex gap-8">
        <div className="flex items-center">
          <div className="relative after:absolute after:inset-0 after:bg-default">
            <input
              id={id + "-remember-yes"}
              name={id + "-remember-payment"}
              type="radio"
              className={
                "h-5 w-5 block relative peer " +
                " after:absolute after:rounded-full after:inset-0 " +
                " after:bg-white_primary/25 checked:after:bg-primary " +
                " before:absolute before:-left-1 before:-top-1 before:h-7 before:w-7 hover:before:bg-white/30 " +
                " before:rounded-full before:transition-colors " +
                " after:z-[1] before:z-[1] "
              }
            />
            <CheckMarkSvg />
          </div>
          <label htmlFor={id + "-remember-yes"} className="pl-2">
            Yes
          </label>
        </div>
        <div className="flex items-center">
          <div className="relative after:absolute after:inset-0 after:bg-default">
            <input
              id={id + "-remember-no"}
              name={id + "-remember-payment"}
              type="radio"
              className={
                "h-5 w-5 block relative group " +
                " after:absolute after:rounded-full after:inset-0 " +
                " after:bg-white_primary/25 checked:after:bg-primary " +
                " before:absolute before:-left-1 before:-top-1 before:h-7 before:w-7 hover:before:bg-white/30 " +
                " before:rounded-full before:transition-colors " +
                " after:z-[1] before:z-[1] "
              }
            />
            <CheckMarkSvg />
          </div>
          <label htmlFor={id + "-remember-no"} className="pl-2">
            No
          </label>
        </div>
      </div>
      <p className="text-xs text-white_primary/60 mt-2">
        By choosing to save your payment information, this payment method will
        be selected as the default for all purchases made using Epic Games
        payment, including purchases in Fortnite, Rocket League, Fall Guys and
        the Epic Games Store. You can delete your saved payment information
        anytime on this payment screen or by logging in to your Epic Games
        account, and selecting payment management in your account settings.
      </p>
    </>
  );
}
