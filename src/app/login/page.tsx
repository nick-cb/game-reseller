import { LoginView } from '@/components/pages/auth/LoginView';
import Image from 'next/image';
import { Suspense } from 'react';

export default function LoginPage() {
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
          className="hidden object-cover lg:block"
        />
        <div className="flex-grow overflow-hidden px-8">
          <Suspense>
            <LoginView />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
