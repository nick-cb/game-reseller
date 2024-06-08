'use client';

import { Dialog, DialogContent } from '@/components/Dialog';
import { useRouter } from 'next/navigation';
import React, { useRef, useEffect, Suspense } from 'react';
import { SignupView } from '@/components/pages/auth/SignupView';
import { SnackContextProvider } from '@/components/SnackContext';

export default function SignupModal(props: PageProps) {
  const { searchParams } = props;
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
        <DialogContent as="div" className="h-min overflow-hidden p-8">
          <Suspense>
            <SignupView searchParams={searchParams} />
          </Suspense>
        </DialogContent>
      </SnackContextProvider>
    </Dialog>
  );
}
