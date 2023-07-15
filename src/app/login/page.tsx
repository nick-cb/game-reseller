"use client";

import { SnackContext, SnackContextProvider } from "@/components/SnackContext";
import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import { startTransition, useContext, useRef, useState } from "react";
import Image from "next/image";
import React from "react";
import StandardButton from "@/components/StandardButton";
import { useForm, UseFormReturn } from "react-hook-form";
import { InterposedInput, PasswordInput } from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {createNewUser} from "@/actions/users";

export default function index() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const translateRef = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLFormElement>(null);
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

  const { showMessage } = useContext(SnackContext);
  const { handleSubmit } = form;

  const submitHandler = async (values: EmailLoginFormPayload) => {
    const user = await createNewUser(values);
    showMessage({ message: "Login successful", type: "success" });
    localStorage.setItem("user", JSON.stringify(user));
    closeDialog();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const strategyContainer = translateRef.current;
    const strategyList = ref1.current;
    const emailStrategy = ref2.current;
    if (!dialog || !strategyContainer || !strategyList || !emailStrategy) {
      return;
    }
    if (!visible) {
      dialog.style.removeProperty("height");
      dialog.style.removeProperty("width");
      strategyContainer.style.removeProperty("height");
      strategyContainer.style.removeProperty("width");
      strategyContainer.style.removeProperty("transform");
      return;
    }
    const dialogHeight = dialog.clientHeight;
    const dialogWidth = dialog.clientWidth;
    const strategyContainerHeight = strategyContainer.clientHeight;
    const strategyContainerWidth = strategyContainer.clientWidth;
    const emptyDialogHeight = dialogHeight - strategyContainerHeight;
    const emptyDialogWidth = dialogWidth - strategyContainerWidth;

    if (strategy === undefined) {
      dialog.style.setProperty(
        "height",
        emptyDialogHeight + strategyList.clientHeight + 64 + "px"
      );
      strategyContainer.style.setProperty(
        "height",
        strategyList.clientHeight + 64 + "px"
      );
      dialog.style.setProperty(
        "width",
        emptyDialogWidth + strategyList.clientWidth + 40 + "px"
      );
      strategyContainer.style.setProperty(
        "width",
        strategyList.clientWidth + 40 + "px"
      );
    }
    if (strategy === "email") {
      strategyContainer.style.setProperty(
        "transform",
        `translateX(-${strategyList.clientWidth + 20}px)`
      );
      dialog.style.setProperty(
        "height",
        emptyDialogHeight + emailStrategy.clientHeight + 64 + "px"
      );
      strategyContainer.style.setProperty(
        "height",
        emailStrategy.clientHeight + 64 + "px"
      );
      dialog.style.setProperty(
        "width",
        emptyDialogWidth + emailStrategy.clientWidth + 40 + "px"
      );
      strategyContainer.style.setProperty(
        "width",
        emailStrategy.clientWidth + 40 + "px"
      );
    }
  }, [strategy, visible]);

  return (
    <dialog
      ref={dialogRef}
      open={visible}
      className={
        "bg-paper_2 rounded-lg shadow-lg shadow-black text-white_primary p-0 transition-[height,_width] duration-200 ease-out overflow-hidden " +
        "opacity-0 inset-0 m-auto fixed " +
        "backdrop:backdrop-blur-xl backdrop-brightness-50 " +
        "animate-[300ms_slide-in-down,_400ms_fade-in] [animation-fill-mode:_forwards] " +
        "[animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)]" +
        (!visible ? "" : "pointer-events-none")
      }
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
          <div
            className="flex px-5 py-8 transition-transform duration-200 gap-5"
            ref={translateRef}
          >
            <StrategyList
              onClickStrategy={(_, s) => {
                setStrategy(s);
              }}
              ref={ref1}
            />
            <EmailLoginForm
              ref={ref2}
              form={form}
              onSubmit={(e) => {
                e.preventDefault();
                startTransition(() => {
                  handleSubmit(submitHandler)(e);
                });
              }}
              className={"h-max"}
            />
          </div>
          <p className="text-white_primary/60 text-center pb-8 text-sm">
            Don't have an account? Signup now!
          </p>
        </div>
      </SnackContextProvider>
    </dialog>
  );
}

const StrategyList = React.forwardRef<
  HTMLDivElement,
  {
    onClickStrategy: (
      event: React.MouseEvent<HTMLButtonElement, any>,
      strategy: "email" | "facebook" | "google" | "apple"
    ) => void;
  }
>(function ({ onClickStrategy }, ref) {
  return (
    <div ref={ref} className="flex flex-col justify-center items-center h-max">
      <button
        onClick={(event) => {
          onClickStrategy(event, "email");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-default flex justify-center items-center">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
            width={24}
            height={24}
            alt=""
          />
        </div>
        <p className="px-4">Login with Email</p>
      </button>
      <hr className="border-paper_2 my-2" />
      <button
        onClick={(event) => {
          onClickStrategy(event, "facebook");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-[#135FC2] flex justify-center items-center">
          <Image
            src="/images/facebook-white.png"
            width={24}
            height={24}
            alt=""
          />
        </div>
        <p className="px-4">Login with Facebook</p>
      </button>
      <hr className="border-paper_2 my-2" />
      <button
        onClick={(event) => {
          onClickStrategy(event, "facebook");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-white_primary flex justify-center items-center">
          <Image
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            width={24}
            height={24}
            alt=""
          />
        </div>
        <p className="px-4">Login with Google</p>
      </button>
      <hr className="border-paper_2 my-2" />
      <button
        onClick={(event) => {
          onClickStrategy(event, "facebook");
        }}
        className="rounded overflow-hidden flex items-center bg-paper w-96 hover:brightness-125 transition-[filter]"
      >
        <div className="w-20 py-4 bg-white flex justify-center items-center">
          <Image src="/images/apple-black.png" width={24} height={24} alt="" />
        </div>
        <p className="px-4">Login with Apple</p>
      </button>
    </div>
  );
});

export type EmailLoginFormPayload = {
  firstname: string;
  lastname: string;
  displayname: string;
  email: string;
  password: string;
  confirm_password: string;
};
const EmailLoginForm = React.forwardRef<
  HTMLFormElement,
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & { form: UseFormReturn<EmailLoginFormPayload, any, undefined> }
>(function ({ form, className = "", ...props }, ref) {
  const { register } = form;

  return (
    <form
      ref={ref}
      className={
        "grid grid-cols-[max-content_min-content] gap-x-4 gap-y-5 " + className
      }
      {...props}
    >
      <label htmlFor="first-name" className="w-max my-auto">
        Fist name
      </label>
      <InterposedInput
        id="first-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#user-generic-1"
        className="p-3"
        placeholder="First name"
        {...register("firstname")}
      />
      <label htmlFor="last-name" className="w-max my-auto">
        Last name
      </label>
      <InterposedInput
        id="last-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#user-generic-1"
        className="p-3"
        placeholder="Last name"
        {...register("lastname")}
      />
      <label htmlFor="display-name" className="w-max my-auto">
        Display name
      </label>
      <InterposedInput
        id="display-name"
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#spartan-helmet"
        className="p-3"
        placeholder="Darth vader"
        {...register("displayname")}
      />
      <label htmlFor="email" className="w-max my-auto">
        Email
      </label>
      <InterposedInput
        id="email"
        type={"email"}
        leftIconProps={{
          className: "fill-transparent stroke-white ml-3",
        }}
        leftIcon="/svg/sprites/actions.svg#email"
        placeholder="Enter your email"
        className="p-3"
        {...register("email")}
      />
      <label htmlFor="password" className="w-max my-auto">
        Password
      </label>
      <PasswordInput
        id={"password"}
        leftIconProps={{
          className: "fill-white !stroke-white ml-3",
        }}
        placeholder="Enter your password"
        className="p-3"
        {...register("password")}
      />
      <label htmlFor="confirm-password" className="w-max my-auto">
        Confirm password
      </label>
      <PasswordInput
        id={"confirm-password"}
        leftIconProps={{
          className: "fill-white !stroke-white ml-3",
        }}
        leftIcon={"/svg/sprites/actions.svg#password-retry"}
        placeholder="Re-Enter your password"
        className="p-3"
        {...register("confirm_password")}
      />
      <StandardButton
        type="submit"
        className="col-span-2 shadow shadow-default mt-2"
        loading={form.formState.isSubmitting}
      >
        Login
      </StandardButton>
    </form>
  );
});
function useContext(SnackContext: React.Context<{showMessage: (snack: import("@/components/SnackContext").Snack) => void;}>): {showMessage: any;} {
  throw new Error("Function not implemented.");
}

