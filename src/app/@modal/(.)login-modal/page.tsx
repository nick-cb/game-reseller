"use client";

import { Dialog, DialogContent } from "@/components/Dialog";
import { useEffect, useLayoutEffect, useRef } from "react";
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

  useLayoutEffect(() => {
    setTimeout(() => {
      dialogRef.current?.showModal();
    }, 100)
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      onClose={() => {
        router.back();
      }}
      className="z-50 min-h-[560px] h-max"
    >
      <SnackContextProvider>
        <DialogContent as="div" className={'overflow-hidden h-min'}>
          <LoginView order={searchParams["order"]} modal />
        </DialogContent>
      </SnackContextProvider>
    </Dialog>
  );
}
