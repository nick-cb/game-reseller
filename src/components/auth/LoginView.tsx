'use client';

import AuthActions from '@/actions/auth-actions';
import { AnimatedSizeItem, AnimatedSizeProvider } from '@/components/AnimatedSizeProvider';
import { SnackContext } from '@/components/SnackContext';
import { EmailLoginForm, EmailLoginFormPayload } from '@/components/auth/email';
import { StrategyList } from '@/components/auth/list';
import { BASE_URL } from '@/utils/config';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function LoginView({ modal, order }: { modal: boolean; order?: string }) {
  const [strategy, setStrategy] = useState<'email' | 'facebook' | 'google' | 'apple'>();
  const [direction, setDirection] = useState<1 | 0>(1);

  const { showMessage } = useContext(SnackContext);
  const form = useForm<EmailLoginFormPayload>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      })
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = form;

  const submitHandler = async (values: EmailLoginFormPayload) => {
    const { error } = await AuthActions.users.login(values);
    if (error) {
      showMessage({ message: error.message, type: 'error' });
      return;
    }
    showMessage({ message: 'Login successfully', type: 'success' });
    setTimeout(() => {
      if (order) {
        console.log({ order, href: BASE_URL + '/' + order + '/order' });
        window.location.href = BASE_URL + '/' + order + '/order';
      } else {
        window.location.href = BASE_URL;
      }
    }, 1000);
  };

  return (
    <>
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2"
        width={64}
        height={64}
        alt=""
        className="mx-auto my-8"
      />
      <div className="relative mt-4 flex w-full items-center justify-center">
        <p className="text-center text-xl">Login</p>
      </div>
      <AnimatedSizeProvider
        as="div"
        animationOptions={{
          duration: 250,
          easing: 'ease-out',
          fill: 'forwards',
        }}
        onStartAnimate={(_, { element: prevEl }, { element: currEl }) => {
          setTimeout(() => {
            if (!prevEl) {
              return;
            }
            prevEl?.animate(currentConfig[direction], {
              duration: 250,
              easing: 'ease-out',
              fill: 'forwards',
            });
            currEl?.animate(nextConfig[direction], {
              duration: 250,
              easing: 'ease-out',
              fill: 'forwards',
            });
          }, 50);
        }}
        className={'relative'}
      >
        <AnimatedSizeItem className={'w-max py-8 3/4sm:px-5 '} active={!strategy} delay={50}>
          <StrategyList
            type={'login'}
            onClickStrategy={(_, newStrategy) => {
              setStrategy(newStrategy);
              setDirection(1);
            }}
          />
        </AnimatedSizeItem>
        <AnimatedSizeItem
          active={strategy === 'email'}
          className={
            'absolute top-0 w-max py-8 opacity-0 3/4sm:px-5 ' +
            (strategy === 'email' ? '' : 'pointer-events-none')
          }
          delay={100}
        >
          <EmailLoginForm
            form={form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(submitHandler)(e);
            }}
            className={'h-max '}
          />
          {strategy !== undefined && (
            <>
              <hr className="my-2 border-paper_2" />
              <button
                className={
                  'text-sm transition-colors hover:bg-white/25 ' +
                  'w-full rounded py-2 ' +
                  'border border-white/60'
                }
                onClick={() => {
                  setStrategy(undefined);
                  setDirection(0);
                }}
                disabled={form.formState.isSubmitting}
              >
                Go back
              </button>
            </>
          )}
        </AnimatedSizeItem>
      </AnimatedSizeProvider>
      <p className="pb-8 text-center text-sm text-white_primary/60">
        Don't have an account?{' '}
        <Link
          prefetch
          href={{
            pathname: '/signup',
            ...(modal
              ? {
                  query: {
                    type: 'modal',
                  },
                }
              : {}),
          }}
          className="cursor-pointer text-white_primary"
        >
          Signup now!
        </Link>
      </p>
    </>
  );
}

const currentConfig = {
  0: [
    { transform: 'translateX(0px)', opacity: '1' },
    { transform: 'translateX(100%)', opacity: '0' },
  ],
  1: [
    { transform: 'translateX(0px)', opacity: '1' },
    { transform: 'translateX(-100%)', opacity: '0' },
  ],
};
const nextConfig = {
  0: [
    { transform: 'translateX(-100%)', opacity: '0' },
    { transform: 'translateX(0px)', opacity: '1' },
  ],
  1: [
    { transform: 'translateX(100%)', opacity: '0' },
    { transform: 'translateX(0px)', opacity: '1' },
  ],
};
