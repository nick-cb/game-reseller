'use client';

import { EmailSignupForm } from '@/components/pages/auth/email';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { StrategyLayout, StrategyItem, GobackButton } from './StrategyLayout';
import { StrategyList } from './StrategyList';

export function SignupView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get('type') === 'modal';

  return (
    <>
      <Image src="/images/logo.png" width={64} height={64} alt="" className="mx-auto mb-4 mt-8" />
      <div className="relative my-4 flex w-full items-center justify-center">
        <p className="text-center text-xl">Signup</p>
      </div>
      <StrategyLayout>
        <StrategyItem
          strategy="no-strategy"
          className={'flex w-max flex-col items-center justify-center gap-4'}
        >
          <StrategyList actionType="signup" />
        </StrategyItem>
        <StrategyItem strategy="email">
          <EmailSignupForm />
          <GobackButton />
        </StrategyItem>
      </StrategyLayout>
      <p className="mt-4 pb-8 text-center text-sm text-white_primary/60">
        Already have an account?{' '}
        <Link
          prefetch
          href={{
            pathname: '/login',
            ...(modal ? { query: { type: 'modal' } } : {}),
          }}
          onClick={(event) => {
            if (!modal) {
              event.preventDefault();
              router.push('/login');
            }
          }}
          className="cursor-pointer text-white_primary"
        >
          Login now!
        </Link>
      </p>
    </>
  );
}
