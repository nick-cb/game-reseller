"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EmailSignupForm,
  EmailSignupFormPayload,
} from "@/components/auth/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SnackContextProvider } from "@/components/SnackContext";
import Image from "next/image";
import {
  AnimatedSizeItem,
  AnimatedSizeProvider,
} from "@/components/AnimatedSizeProvider";
import { StrategyList } from "@/components/auth/list";
import Link from "next/link";
import { useRouter } from "next/navigation";

const currentConfig = {
  0: [
    { transform: "translateX(0px)", opacity: "1" },
    { transform: "translateX(100%)", opacity: "0" },
  ],
  1: [
    { transform: "translateX(0px)", opacity: "1" },
    { transform: "translateX(-100%)", opacity: "0" },
  ],
};
const nextConfig = {
  0: [
    { transform: "translateX(-100%)", opacity: "0" },
    { transform: "translateX(0px)", opacity: "1" },
  ],
  1: [
    { transform: "translateX(100%)", opacity: "0" },
    { transform: "translateX(0px)", opacity: "1" },
  ],
};

export function SignupView({
  visible,
  closeDiaglog,
  modal,
}: {
  visible?: boolean;
  modal?: boolean;
  closeDiaglog?: () => void;
}) {
  const router = useRouter();
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const [direction, setDirection] = useState<1 | 0>(1);
  const form = useForm<EmailSignupFormPayload>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(
      z.object({
        email: z.string().nonempty(),
      }),
    ),
  });
  const { handleSubmit } = form;

  const submitHandler = async (values: EmailSignupFormPayload) => {
    // const user = await createNewUser(values);
    // showMessage({ message: "Login successful", type: "success" });
    // localStorage.setItem("user", JSON.stringify(user));
    // closeDialog();
  };

  return (
    <SnackContextProvider>
      <div
        className={
          "h-max " +
          (!visible ?? (!visible ? "pointer-events-none opacity-0 px-0" : ""))
        }
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
          width={64}
          height={64}
          alt=""
          className="mx-auto my-8"
        />
        <div className="flex items-center justify-center w-full mt-4 relative">
          <p className="text-xl text-center">Signup</p>
        </div>
      </div>

      <AnimatedSizeProvider
        key={visible?.toString()}
        as="div"
        animationOptions={{
          duration: 250,
          easing: "ease-out",
          fill: "forwards",
        }}
        onStartAnimate={(_, { element: prevEl }, { element: currEl }) => {
          setTimeout(() => {
            if (!prevEl) {
              return;
            }
            prevEl?.animate(currentConfig[direction], {
              duration: 250,
              easing: "ease-out",
              fill: "forwards",
            });
            currEl?.animate(nextConfig[direction], {
              duration: 250,
              easing: "ease-out",
              fill: "forwards",
            });
          }, 50);
        }}
        className={"relative"}
      >
        <AnimatedSizeItem
          className={"px-5 py-8 w-max "}
          // @ts-ignore
          active={!strategy && visible}
          // delay={50}
        >
          <StrategyList
            type={"signup"}
            onClickStrategy={(_, newStrategy) => {
              setStrategy(newStrategy);
              setDirection(1);
            }}
          />
        </AnimatedSizeItem>
        <AnimatedSizeItem
          // @ts-ignore
          active={visible && strategy === "email"}
          className={
            "absolute px-5 py-8 top-0 opacity-0 " +
            (strategy === "email" ? "" : "pointer-events-none")
          }
        >
          <EmailSignupForm
            form={form}
            onSubmit={(e) => {
              e.preventDefault();
              startTransition(() => {
                handleSubmit(submitHandler)(e);
              });
            }}
            className={"h-max "}
          />
          {strategy !== undefined && (
            <>
              <hr className="my-2 border-paper_2" />
              <button
                className={
                  "hover:bg-white/25 transition-colors text-sm " +
                  "rounded w-full py-2 " +
                  "border border-white/60"
                }
                onClick={() => {
                  setStrategy(undefined);
                  setDirection(0);
                }}
              >
                Go back
              </button>
            </>
          )}
        </AnimatedSizeItem>
      </AnimatedSizeProvider>
      <p className="text-white_primary/60 text-center pb-8 text-sm">
        Already have an account?{" "}
        <Link
          href={{
            pathname: "/login",
            ...(modal
              ? {
                  query: {
                    type: "modal",
                  },
                }
              : {}),
          }}
          className="text-white_primary cursor-pointer"
          onClick={(event) => {
            if (modal !== true) {
              event.preventDefault();
              router.push("/login");
            }
          }}
        >
          Login now!
        </Link>
      </p>
    </SnackContextProvider>
  );
}
