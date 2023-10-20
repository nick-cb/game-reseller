"use client";

import { Dialog, DialogContent } from "@/components/Dialog";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoginView } from "@/components/auth/LoginView";
import { SnackContextProvider } from "@/components/SnackContext";

export default function LoginModal({
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
      className="z-50"
    >
      <SnackContextProvider>
        <DialogContent as="div">
          <LoginView order={searchParams["order"]} modal />
        </DialogContent>
      </SnackContextProvider>
    </Dialog>
  );
}
