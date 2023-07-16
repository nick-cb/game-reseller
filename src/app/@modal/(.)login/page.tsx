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

export default function LoginModal() {
  const [strategy, setStrategy] = useState<
    "email" | "facebook" | "google" | "apple"
  >();
  const [visible, setVisible] = useState(false);
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
      className={!visible ? "pointer-events-none opacity-0 px-0" : ""}
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
          <div className="flex items-center justify-center w-full mt-4 relative">
            {strategy !== undefined && (
              <button
                className={
                  "hover:bg-white/25 transition-colors absolute left-3 px-2 py-1 rounded text-sm"
                }
                onClick={() => {
                  setStrategy(undefined);
                }}
              >
                Go back
              </button>
            )}
            <p className="text-xl text-center">Login</p>
          </div>
          <AnimatedSizeProvider
            key={visible.toString()}
            as="div"
            onStartAnimate={async (
              _,
              { element: prevEl },
              { element: currEl }
            ) => {
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
                type={"login"}
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