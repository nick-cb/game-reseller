import React from 'react';
import Image from 'next/image';
import { mergeCls } from '@/utils';

type StrategyButtonProps = JSX.IntrinsicElements['button'] & {
  Logo: React.ReactNode;
  Label: React.ReactNode;
};
export function StrategyButton(props: StrategyButtonProps) {
  const { Logo, Label, className, ...rest } = props;
  return (
    <button
      className={mergeCls(
        className,
        'flex w-80 items-center overflow-hidden rounded transition-[filter] disabled:opacity-50 3/4sm:w-96',
        'bg-paper [&:not([disabled])]:hover:brightness-125'
      )}
      {...rest}
    >
      {Logo}
      {Label}
    </button>
  );
}
type StrategyLabelProps = JSX.IntrinsicElements['p'] & {
  actionType: 'login' | 'signup';
  strategy: 'email' | 'facebook' | 'google' | 'apple';
};
export function StrategyLabel(props: StrategyLabelProps) {
  const { actionType, strategy, className, ...rest } = props;
  const actionText = actionType[0].toUpperCase() + actionType.slice(1);
  const strategyText = strategy[0].toUpperCase() + strategy.slice(1);
  return (
    <p className={'px-4'} {...rest}>
      {actionText} with {strategyText}
    </p>
  );
}
type StrategyLogoProps = {
  strategy: 'email' | 'facebook' | 'google' | 'apple';
};
export function StrategyLogo(props: StrategyLogoProps) {
  return (
    <div
      className={mergeCls('flex w-20 items-center justify-center bg-default py-4')}
      style={{
        backgroundColor: strategyConfigs[props.strategy].colors.accent,
      }}
    >
      <Image src={strategyConfigs[props.strategy].image} width={24} height={24} alt="" />
    </div>
  );
}
const strategyConfigs = {
  email: {
    image:
      'https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/269863143_480068400349256_2256909955739492979_n.png?alt=media&token=3a12e3c5-a40d-4747-8607-a42eb4917cd2',
    colors: {
      accent: 'hsl(0, 0%, 11%)',
    },
  },
  facebook: {
    image: '/images/facebook-white.png',
    colors: {
      accent: '#135FC2',
    },
  },
  google: {
    image:
      'https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA',
    colors: {
      accent: 'white',
    },
  },
  apple: {
    image: '/images/apple-black.png',
    colors: { accent: 'white' },
  },
};
