'use client';

import { EmailLoginForm } from '@/components/pages/auth/email';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { StrategyList } from './StrategyList';
import { GobackButton, StrategyItem, StrategyLayout } from '@/components/pages/auth/StrategyLayout';

export type Strategy = 'no-strategy' | 'email' | 'facebook' | 'google' | 'apple';
export function LoginView() {
  const searchParams = useSearchParams();
  console.log(Array.from(searchParams.entries()));

  return (
    <>
      <Image src="/images/logo.png" width={64} height={64} alt="" className="mx-auto mb-4 mt-8" />
      <div className="relative my-4 flex w-full items-center justify-center">
        <p className="text-center text-xl">Login</p>
      </div>
      <StrategyLayout>
        <StrategyItem
          strategy="no-strategy"
          className={'flex w-max flex-col items-center justify-center gap-4'}
        >
          <StrategyList actionType="login" />
        </StrategyItem>
        <StrategyItem strategy="email">
          <EmailLoginForm />
          <GobackButton />
        </StrategyItem>
      </StrategyLayout>
      <p className="mt-4 pb-8 text-center text-sm text-white_primary/60">
        Don't have an account?{' '}
        <Link
          prefetch
          href={{
            pathname: '/signup',
            ...(searchParams.get('type') === 'modal' ? { query: { type: 'modal' } } : {}),
          }}
          className="cursor-pointer text-white_primary"
        >
          Signup now!
        </Link>
      </p>
    </>
  );
}
