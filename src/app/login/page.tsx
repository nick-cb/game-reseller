"use client";

import { SnackContext } from "@/components/SnackContext";
import { startTransition, useContext, useRef, useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createNewUser } from "@/actions/users";
import {
  AnimatedSizeProvider,
  AnimatedSizeItem,
} from "@/components/AnimatedSizeProvider";
import {
  EmailSignupFormPayload,
  EmailSignupForm,
} from "@/components/auth/email";
import { StrategyList } from "@/components/auth/list";

export default function Login() {
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const translateRef = useRef<HTMLDivElement>(null);
  const form = useForm<EmailSignupFormPayload>({
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
        }),
    ),
  });

  const { showMessage } = useContext(SnackContext);
  const { handleSubmit } = form;

  const submitHandler = async (values: EmailSignupFormPayload) => {
    const user = await createNewUser(values);
    showMessage({ message: "Login successful", type: "success" });
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <AnimatedSizeProvider
      as="div"
      className="flex gap-5"
      // @ts-ignore
      ref={translateRef}
      onStartAnimate={async (_, { element: prevEl }, { element: currEl }) => {
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
          },
        );
        const ani2 = currEl?.animate(
          [
            { transform: "translateY(-15%)" },
            { transform: "translateX(-100%)", opacity: "1" },
          ],
          {
            duration: 200,
            easing: "ease-out",
          },
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
        className={"absolute left-full px-5 py-8 "}
        active={!strategy}
      >
        <StrategyList
          onClickStrategy={(_, s) => {
            setStrategy(s);
          }}
          type={"login"}
        />
      </AnimatedSizeItem>
      <AnimatedSizeItem
        active={strategy === "email"}
        className={"absolute left-full px-5 py-8 "}
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
      </AnimatedSizeItem>
    </AnimatedSizeProvider>
  );
}
