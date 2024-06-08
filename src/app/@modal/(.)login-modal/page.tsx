'use client';

import { Dialog, DialogContent } from '@/components/Dialog';
import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoginView } from '@/components/pages/auth/LoginView';
import { SnackContextProvider } from '@/components/SnackContext';

export default function LoginModal(props: PageProps) {
  const { searchParams } = props;
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
      className="z-50 w-auto md:max-w-max"
    >
      <SnackContextProvider>
        <DialogContent as="div" className={'h-min overflow-hidden p-4 sm:p-8'}>
          <LoginView searchParams={searchParams} />
        </DialogContent>
      </SnackContextProvider>
    </Dialog>
  );
}
