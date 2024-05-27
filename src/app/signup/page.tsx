import Image from 'next/image';
import { SignupView } from '@/components/pages/auth/SignupView';
import { Suspense } from 'react';

export default function SignupPage() {
  const random = Math.floor(Math.random() * 10 + 1);

  return (
    <div className="my-auto flex items-center justify-center">
      <Image
        src={`/images/login-splash-${random < 10 ? '0' + random : random}.jpg`}
        alt={''}
        width={500}
        height={250}
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-40 blur-lg"
      />
      <div className="z-[1] flex overflow-hidden rounded bg-paper_2 shadow-md shadow-paper_3">
        <Image
          src={`/images/login-splash-${random < 10 ? '0' + random : random}.jpg`}
          alt={''}
          width={500}
          height={250}
          className="hidden w-[300px] object-cover lg:block xl:w-[400px] 2xl:w-auto"
        />
        <div className="flex-grow overflow-hidden px-4">
          <Suspense>
            <SignupView />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
