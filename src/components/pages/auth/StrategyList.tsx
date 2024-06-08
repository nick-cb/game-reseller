'use client';

import { mergeCls } from '@/utils';
import { Strategy } from './LoginView';
import Image from 'next/image';
import {useStrategyLayout} from "@/components/pages/auth/StrategyLayout";

type StrategyListProps = {
  actionType: 'login' | 'signup';
};
export function StrategyList(props: StrategyListProps) {
  const { actionType } = props;
  return (
    <>
      <StrategyButton actionType={actionType} strategy="email" />
      <StrategyButton actionType={actionType} strategy="facebook" />
      <StrategyButton actionType={actionType} strategy="google" />
      <StrategyButton actionType={actionType} strategy="apple" />
    </>
  );
}

type StrategyButtonProps = {
  actionType: 'login' | 'signup';
  strategy: Exclude<Strategy, 'no-strategy'>;
};
function StrategyButton(props: StrategyButtonProps) {
  const { actionType, strategy } = props;
  const { changeStrategy } = useStrategyLayout();
  return (
    <button
      data-button-strategy={props.strategy}
      disabled={props.strategy !== 'email'}
      className={mergeCls(
        'flex items-center overflow-hidden rounded transition-[filter] disabled:opacity-50',
        'bg-paper [&:not([disabled])]:hover:brightness-125'
      )}
      onClick={changeStrategy}
    >
      <div
        className={mergeCls('flex w-16 3/4sm:w-20 items-center justify-center bg-default py-4')}
        style={{
          backgroundColor: strategyConfigs[props.strategy].colors.bg,
        }}
      >
        <Image src={strategyConfigs[props.strategy].image} width={24} height={24} alt="" />
      </div>
      <p className={'px-4'}>
        {actionType[0].toUpperCase() + actionType.slice(1)} with {strategy}
      </p>
    </button>
  );
}

const strategyConfigs = {
  email: {
    image: '/images/logo.png',
    colors: {
      bg: 'hsl(0, 0%, 11%)',
    },
  },
  facebook: {
    image: '/images/facebook-white.png',
    colors: {
      bg: '#135FC2',
    },
  },
  google: {
    image: '/images/google.png',
    colors: {
      bg: 'white',
    },
  },
  apple: {
    image: '/images/apple-black.png',
    colors: { bg: 'white' },
  },
} as const;
