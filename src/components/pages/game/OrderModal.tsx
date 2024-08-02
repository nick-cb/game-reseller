"use client";

import { Dialog, DialogContent } from "../../Dialog";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ItemOrderModal({ children }: PropsWithChildren) {
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
      className="lg:w-3/4 2xl:w-2/3 p-4 !overflow-y-hidden !bg-default"
    >
      <DialogContent
        as="div"
        className="flex flex-col-reverse md:grid md:grid-rows-[minmax(0px,auto)_min-content] gap-8 w-full"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
