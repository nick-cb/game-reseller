"use client";

import {
  AnimatedSizeProvider,
  AnimatedSizeItem,
} from "@/components/AnimatedSizeProvider";
import { EmailLoginForm, EmailLoginFormPayload } from "@/components/auth/email";
import { StrategyList } from "@/components/auth/list";
import { Dialog } from "@/components/Dialog";
import { SnackContext, SnackContextProvider } from "@/components/SnackContext";
import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const currentConfig = {
  0: [{transform: 'translateX(0px)', opacity: '1'}, {transform: 'translateX(100%)', opacity: '0'}],
  1: [{transform: 'translateX(0px)', opacity: '1'}, {transform: 'translateX(-100%)', opacity: '0'}]
}

const nextConfig = {
  0: [{transform: 'translateX(-100%)', opacity: '0'}, {transform: 'translateX(0px)', opacity: '1'}],
  1: [{transform: 'translateX(100%)', opacity: '0'}, {transform: 'translateX(0px)', opacity: '1'}],
}

export default function LoginModal() {
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState<1 | 0>(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

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
    startTransition(() => {
      router.back();
    });
  };

  const contentContainerRef =
    useClickOutsideCallback<HTMLDivElement>(closeDialog);

  const { showMessage } = useContext(SnackContext);
  const form = useForm<EmailLoginFormPayload>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(
      z.object({
        email: z.string().nonempty(),
      })
    ),
  });
  const { handleSubmit } = form;

  const submitHandler = async (values: EmailLoginFormPayload) => {
    // const user = await createNewUser(values);
    // showMessage({ message: "Login successful", type: "success" });
    // localStorage.setItem("user", JSON.stringify(user));
    // closeDialog();
  };

  useEffect(() => {
    dialogRef.current?.showModal();
    setVisible(true);
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      // className={!visible ? "pointer-events-none opacity-0 px-0" : ""}
    >
      <SnackContextProvider>
        <div
          className={
            "h-max " + (!visible ? "pointer-events-none opacity-0 px-0" : "")
          }
          ref={contentContainerRef}
        >
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
            key={visible.toString()}
            as="div"
            animationOptions={{
              duration: 250,
              easing: "ease-out",
              fill: "forwards",
            }}
            onStartAnimate={(_, { element: prevEl }, { element: currEl }) => {
              console.log({ strategy });
              setTimeout(() => {
                if (!prevEl) {
                  return;
                }
                prevEl?.animate(
                  currentConfig[direction],
                  {
                    duration: 250,
                    easing: "ease-out",
                    fill: "forwards",
                  }
                );
                currEl?.animate(
                  nextConfig[direction],
                  {
                    duration: 250,
                    easing: "ease-out",
                    fill: "forwards",
                  }
                );
              }, 50);
            }}
            className={"relative"}
          >
            <AnimatedSizeItem
              className={"px-5 py-8 w-max "}
              active={!strategy && visible}
              // delay={50}
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
              active={visible && strategy === "email"}
              className={
                "absolute px-5 py-8 top-0 opacity-0 " +
                (strategy === "email" ? "" : "pointer-events-none")
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
            Don't have an account?{" "}
            <Link
              href={gameId ? `/signup?gameId=${gameId}` : `/signup`}
              className="text-white_primary cursor-pointer"
              // onClick={() => {
              //   router.push();
              // }}
            >
              Signup now!
            </Link>
          </p>
        </div>
      </SnackContextProvider>
    </Dialog>
  );
}
