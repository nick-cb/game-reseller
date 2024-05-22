'use client';

import { Dialog, DialogContent } from '@/components/Dialog';
import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoginView } from '@/components/pages/auth/LoginView';
import { SnackContextProvider } from '@/components/SnackContext';

export default function LoginModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    setTimeout(() => {
      dialogRef.current?.showModal();
    }, 100);
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      onClose={() => {
        router.back();
      }}
      className="z-50 h-max min-h-[560px]"
    >
      <SnackContextProvider>
        <DialogContent as="div" className={'h-min overflow-hidden p-8'}>
          <LoginView />
        </DialogContent>
      </SnackContextProvider>
    </Dialog>
  );
}
