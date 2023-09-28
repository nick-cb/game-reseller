"use client";

import { Dialog } from "@/components/Dialog";
import { useRouter } from "next/navigation";
import { useRef, startTransition, useEffect } from "react";
import { SignupView } from "@/components/auth/SignupView";

export default function SignupModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const closeDialog = async () => {
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
    // setStrategy(undefined);
    startTransition(() => {
      router.back();
    });
  };

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      onClose={closeDialog}
      // className={!visible ? "pointer-events-none opacity-0 px-0" : ""}
    >
      <SignupView modal closeDiaglog={closeDialog} />
    </Dialog>
  );
}
