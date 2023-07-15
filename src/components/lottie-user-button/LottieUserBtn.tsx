"use client";

import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import { useLottie } from "lottie-react";
import React, { startTransition, useContext } from "react";
import { useCallback, useRef, useState } from "react";
import lottieuser from "../../../public/user-lottie.json";
import Image from "next/image";
import "./dialog.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SnackContext, SnackContextProvider } from "../SnackContext";
import { createNewUser } from "@/actions/users";
import {
  AnimatedSizeItem,
  AnimatedSizeProvider,
} from "../AnimatedSizeProvider";
import { Dialog } from "../Dialog";
import { EmailLoginForm, EmailLoginFormPayload } from "../auth/email";
import { StrategyList } from "../auth/list";

export function LottieUserButton() {
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const translateRef = useRef<HTMLDivElement>(null);

  const { View, goToAndPlay } = useLottie({
    animationData: lottieuser,
    autoplay: false,
    loop: false,
    style: { width: "20px", height: "20px" },
  });

  const closeDialog = async () => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog?.open) {
      return;
    }
    const slideOutAnimation = dialog.animate(
      [{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }],
      {
        easing: "cubic-bezier(0.5, -0.3, 0.1, 1.5)",
        duration: 300,
      }
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
    setVisible(false);
    setStrategy(undefined);
  };

  const contentContainerRef =
    useClickOutsideCallback<HTMLDivElement>(closeDialog);

  const handler = useCallback(() => {
    goToAndPlay(0);
  }, [goToAndPlay]);

  const { showMessage } = useContext(SnackContext);
  const form = useForm<EmailLoginFormPayload>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(
      z
        .object({
          firstname: z.string().nonempty(),
          lastname: z.string().nonempty(),
          displayname: z.string().nonempty(),
          email: z.string().nonempty(),
          password: z.string().nonempty(),
          confirm_password: z.string().nonempty(),
        })
        .refine((obj) => obj.password === obj.confirm_password, {
          message: "Password not match",
          path: ["password", "confirm_password"],
        })
    ),
  });
  const { handleSubmit } = form;

  const submitHandler = async (values: EmailLoginFormPayload) => {
    const user = await createNewUser(values);
    showMessage({ message: "Login successful", type: "success" });
    localStorage.setItem("user", JSON.stringify(user));
    closeDialog();
  };

  return (
    <>
      <button
        onMouseEnter={handler}
        onClick={() => {
          setVisible(true);
          dialogRef.current?.showModal();
        }}
        className="relative flex items-center gap-2 px-4 rounded overflow-hidden 
        after:absolute after:inset-0 after:bg-white/[.15] after:opacity-0
        hover:after:opacity-100 after:transition-opacity"
      >
        {View} Login
      </button>
      <Dialog
        ref={dialogRef}
        className={!visible ? "pointer-events-none opacity-0" : ""}
      >
        <SnackContextProvider>
          <div className="h-max" ref={contentContainerRef}>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
              width={64}
              height={64}
              alt=""
              className="mx-auto my-8"
            />
            <p className="text-xl mt-4 text-center">Login</p>

            <AnimatedSizeProvider
              key={visible.toString()}
              as="div"
              className="flex gap-5"
              ref={translateRef}
              onStartAnimate={async (
                _,
                { element: prevEl },
                { element: currEl }
              ) => {
                if (strategy === undefined) {
                  currEl?.style.setProperty("left", "0");
                  return;
                }
                const ani1 = prevEl?.animate(
                  [
                    { transform: `translateX(-100%)`, opacity: "1" },
                    { transform: `translateX(-200%)`, opacity: "0" },
                  ],
                  {
                    duration: 200,
                    easing: "ease-out",
                  }
                );
                const ani2 = currEl?.animate(
                  [
                    { transform: "translateY(-15%)" },
                    { transform: "translateX(-100%)", opacity: "1" },
                  ],
                  {
                    duration: 200,
                    easing: "ease-out",
                  }
                );
                ani2?.finished.then(() => {
                  currEl?.style.setProperty("transform", "translateX(-100%)");
                  currEl?.style.setProperty("opacity", "1");
                });
                ani1?.finished.then(() => {
                  prevEl?.style.removeProperty("transform");
                  prevEl?.style.setProperty("left", "100%");
                });
              }}
            >
              <AnimatedSizeItem
                className={
                  "absolute left-full px-5 py-8 " + (visible ? "block" : "hidden")
                }
                active={visible && !strategy}
              >
                <StrategyList
                  onClickStrategy={(_, s) => {
                    setStrategy(s);
                  }}
                />
              </AnimatedSizeItem>
              <AnimatedSizeItem
                active={visible && strategy === "email"}
                className={
                  "absolute left-full px-5 py-8 " + (visible ? "block" : "hidden")
                }
              >
                <EmailLoginForm
                  form={form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    startTransition(() => {
                      handleSubmit(submitHandler)(e);
                    });
                  }}
                  className={"h-max "}
                />
              </AnimatedSizeItem>
            </AnimatedSizeProvider>
            <p className="text-white_primary/60 text-center pb-8 text-sm">
              Don't have an account? Signup now!
            </p>
          </div>
        </SnackContextProvider>
      </Dialog>
    </>
  );
}
