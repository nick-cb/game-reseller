"use client";

import { Dialog } from "@/components/Dialog";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { SignupView } from "@/components/auth/SignupView";
import { SnackContextProvider } from "@/components/SnackContext";

export default function SignupModal({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      onClose={() => {
        router.back();
      }}
    >
      <SnackContextProvider>
        <SignupView order={searchParams["order"]} modal />
      </SnackContextProvider>
    </Dialog>
  );
}
