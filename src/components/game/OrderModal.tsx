"use client";

import { Dialog } from "../Dialog";
import { Game } from "@/database/models";
import Stripe from "stripe";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import { ItemOrder } from "./order/ItemOrder";

export default function ItemOrderModal({
  game,
  children,
}: PropsWithChildren<{
  game: Game;
}>) {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const closeDialog = async (
    _: React.RefObject<HTMLElement>,
    options?: {
      goback?: number;
      replace?: {
        href: string;
      };
    },
  ) => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    const slideOutAnimation = dialog.animate(
      [{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }],
      {
        easing: "cubic-bezier(0.5, -0.3, 0.1, 1.5)",
        duration: 300,
      },
    );
    const fadeOutAnimation = dialog.animate([{ opacity: 1 }, { opacity: 0 }], {
      easing: "cubic-bezier(0.5, -0.3, 0.1, 1.5)",
      duration: 350,
    });
    await Promise.allSettled([
      slideOutAnimation.finished,
      fadeOutAnimation.finished,
    ]);
    dialogRef.current?.close();
    dialog.dataset["goback"] = options?.goback?.toString();
    dialog.dataset["replace_href"] = options?.replace?.href;
  };

  const contentContainerRef =
    useClickOutsideCallback<HTMLDivElement>(closeDialog);

  useEffect(() => {
    dialogRef.current?.showModal();
    setVisible(true);
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      onClose={(event) => {
        const replaceHref = event.currentTarget.dataset["replace_href"];
        if (replaceHref && replaceHref !== "undefined") {
          router.replace(replaceHref);
          return;
        }
        const goback = parseInt(event.currentTarget.dataset["goback"] || "1");
        if (!isNaN(goback) && goback === -1) {
          return;
        }
        for (let i = 0; i < (isNaN(goback) ? 1 : goback); i++) {
          router.back();
        }
      }}
      className="lg:w-3/4 2xl:w-1/2 p-4 !overflow-y-hidden"
    >
      <div
        ref={contentContainerRef}
        className="flex flex-col-reverse md:grid md:grid-rows-[minmax(0px,auto)_min-content] gap-8"
      >
        {visible ? children : null}
        {/* <ItemOrder */}
        {/*   game={game} */}
        {/*   clientSecret={paymentIntent.client_secret!} */}
        {/*   rememberPayment={rememberPayment} */}
        {/* /> */}
      </div>
    </Dialog>
  );
}
