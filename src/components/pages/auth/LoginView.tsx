'use client';

import { EmailLoginForm } from '@/components/pages/auth/email';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { StrategyList } from './StrategyList';
import { GobackButton, StrategyItem, StrategyLayout } from '@/components/pages/auth/StrategyLayout';
import { z } from 'zod';

export type Strategy = 'no-strategy' | 'email' | 'facebook' | 'google' | 'apple';
type LoginViewProps = {
  searchParams: PageProps['searchParams'];
};
export function LoginView(props: LoginViewProps) {
  const { searchParams } = props;
  const type = z.string().catch('').parse(searchParams.type);
  const orderId = z.number().catch(0).parse(searchParams.orderId);

  return (
    <>
      <Image src="/images/logo.png" width={64} height={64} alt="" className="mx-auto mb-4 mt-8" />
      <div className="relative my-4 flex w-full items-center justify-center">
        <p className="text-center text-xl">Login</p>
      </div>
      <StrategyLayout>
        <StrategyItem
          strategy="no-strategy"
          className={'gap-4 flex flex-col w-full md:w-96'}
        >
          <StrategyList actionType="login" />
        </StrategyItem>
        <StrategyItem strategy="email" className='w-full md:w-96'>
          <EmailLoginForm orderId={orderId} />
          <GobackButton />
        </StrategyItem>
      </StrategyLayout>
      <p className="mt-4 pb-8 text-center text-sm text-white_primary/60">
        Don't have an account?{' '}
        <Link
          prefetch
          href={{
            pathname: '/signup',
            ...(type === 'modal' ? { query: { type: 'modal' } } : {}),
          }}
          className="cursor-pointer text-white_primary"
        >
          Signup now!
        </Link>
      </p>
    </>
  );
}
