"use client";

import { Dialog } from "@/components/Dialog";
import { useRouter } from "next/navigation";
import React, { useRef, startTransition, useEffect, useState } from "react";
import { SignupView } from "@/components/auth/SignupView";
import { SnackContextProvider } from "@/components/SnackContext";

export default function SignupModal() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const closeDialog = async (
    _: React.RefObject<HTMLElement>,
    options?: { goback?: number },
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
    dialog.close();
    dialog.dataset["goback"] = options?.goback?.toString();
    setVisible(false);
  };

  useEffect(() => {
    dialogRef.current?.showModal();
    setVisible(true);
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      onClose={(event) => {
        const goback = parseInt(event.currentTarget.dataset["goback"] || "0");
        if (!isNaN(goback) && goback === -1) {
          return;
        }
        startTransition(() => {
          for (let i = 0; i < (isNaN(goback) ? 1 : goback); i++) {
            router.back();
          }
        });
      }}
    >
      <SnackContextProvider>
        <SignupView modal visible={visible} closeDialog={closeDialog} />
      </SnackContextProvider>
    </Dialog>
  );
}
