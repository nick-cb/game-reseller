"use client";

import { Dialog } from "@/components/Dialog";
import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginView } from "@/components/auth/LoginView";
import { SnackContextProvider } from "@/components/SnackContext";

export default function LoginModal() {
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
    setVisible(false);
    // setStrategy(undefined);
  };

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
    >
      <SnackContextProvider>
        <LoginView modal visible={visible} closeDialog={closeDialog} />
      </SnackContextProvider>
    </Dialog>
  );
}
