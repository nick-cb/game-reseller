'use client';

import { EmailSignupForm } from '@/components/pages/auth/email';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StrategyLayout, StrategyItem, GobackButton } from './StrategyLayout';
import { StrategyList } from './StrategyList';
import { z } from 'zod';

type SignupViewProps = {
  searchParams: PageProps['searchParams'];
};
export function SignupView(props: SignupViewProps) {
  const { searchParams } = props;
  const router = useRouter();
  const type = z.string().catch('').parse(searchParams.type);

  return (
    <>
      <Image src="/images/logo.png" width={64} height={64} alt="" className="mx-auto mb-4 mt-8" />
      <div className="relative my-4 flex w-full items-center justify-center">
        <p className="text-center text-xl">Signup</p>
      </div>
      <StrategyLayout>
        <StrategyItem
          strategy="no-strategy"
          className={'gap-4 flex flex-col w-full md:w-96'}
        >
          <StrategyList actionType="signup" />
        </StrategyItem>
        <StrategyItem strategy="email" className='w-full md:w-96'>
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
            ...(type === 'modal' ? { query: { type: 'modal' } } : {}),
          }}
          onClick={(event) => {
            if (type !== 'modal') {
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
