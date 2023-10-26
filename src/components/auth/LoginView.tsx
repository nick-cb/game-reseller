"use client";

import { useContext, useState } from "react";
import { SnackContext } from "@/components/SnackContext";
import { useForm } from "react-hook-form";
import { EmailLoginForm, EmailLoginFormPayload } from "@/components/auth/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  AnimatedSizeItem,
  AnimatedSizeProvider,
} from "@/components/AnimatedSizeProvider";
import { StrategyList } from "@/components/auth/list";
import Link from "next/link";
import { login } from "@/actions/users";
import { BASE_URL } from "@/utils/config";

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

export function LoginView({
  modal,
  order,
}: {
  modal: boolean;
  order?: string;
}) {
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const [direction, setDirection] = useState<1 | 0>(1);

  const { showMessage } = useContext(SnackContext);
  const form = useForm<EmailLoginFormPayload>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(
      z.object({
        email: z.string().nonempty(),
        password: z.string().nonempty(),
      }),
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  const submitHandler = async (values: EmailLoginFormPayload) => {
    const { error } = await login(values);
    if (error) {
      showMessage({ message: error, type: "error" });
      return;
    }
    showMessage({ message: "Login successfully", type: "success" });
    setTimeout(() => {
      if (order) {
        console.log({ order, href: BASE_URL + "/" + order + "/order" });
        window.location.href = BASE_URL + "/" + order + "/order";
      } else {
        window.location.href = BASE_URL;
      }
    }, 1000);
  };

  return (
    <>
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
        width={64}
        height={64}
        alt=""
        className="mx-auto my-8"
      />
      <div className="flex items-center justify-center w-full mt-4 relative">
        <p className="text-xl text-center">Login</p>
      </div>
      <AnimatedSizeProvider
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
          className={"3/4sm:px-5 py-8 w-max "}
          active={!strategy}
          delay={50}
        >
          <StrategyList
            type={"login"}
            onClickStrategy={(_, newStrategy) => {
              setStrategy(newStrategy);
              setDirection(1);
            }}
          />
        </AnimatedSizeItem>
        <AnimatedSizeItem
          active={strategy === "email"}
          className={
            "absolute w-max 3/4sm:px-5 py-8 top-0 opacity-0 " +
            (strategy === "email" ? "" : "pointer-events-none")
          }
          delay={100}
        >
          <EmailLoginForm
            form={form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(submitHandler)(e);
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
                disabled={form.formState.isSubmitting}
              >
                Go back
              </button>
            </>
          )}
        </AnimatedSizeItem>
      </AnimatedSizeProvider>
      <p className="text-white_primary/60 text-center pb-8 text-sm">
        Don't have an account?{" "}
        <Link
          prefetch
          href={{
            pathname: "/signup",
            ...(modal
              ? {
                  query: {
                    type: "modal",
                  },
                }
              : {}),
          }}
          className="text-white_primary cursor-pointer"
        >
          Signup now!
        </Link>
      </p>
    </>
  );
}
