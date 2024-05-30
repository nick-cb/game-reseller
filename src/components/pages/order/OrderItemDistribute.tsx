'use client';

import { useLayoutEffect } from 'react';
import Image from 'next/image';
import { fire } from '@/utils/confettie';

export function OrderItemDistribute({ gameList }: { gameList: any }) {
  useLayoutEffect(() => {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [gameList]);
  const list = [
    '-right-32 -rotate-[30deg] -top-28',
    'bottom-0 -left-40 -rotate-[15deg]',
    '-right-56 -bottom-28 rotate-[10deg]',
    '-top-32 right-40 -translate-y-1/2 rotate-[25deg]',
    'left-12 -bottom-56 rotate-[45deg]',
    '-bottom-64 right-20 -rotate-[10deg]',
    '-left-14 -top-60 -rotate-[25deg]',
  ];
  return (
    <>
      {gameList.map((item: any, index: number) => {
        const image = item.images.portraits[0];
        const shadowColor = image.colors.highestSat;
        if (!list[index]) {
          return null;
        }
        return (
          <Image
            key={item.ID}
            src={image.url}
            width={150}
            height={200}
            alt={item.name}
            title={item.name}
            className={
              'absolute z-[1] rounded ' +
              '[--tw-shadow-colored:0_10px_25px_-3px_var(--tw-shadow-color),_0_-2px_10px_0px_var(--tw-shadow-color),_0_4px_6px_-4px_var(--tw-shadow-color)] ' +
              'shadow-lg shadow-red-500 transition-opacity ' +
              list[index]
            }
            style={{
              boxShadow: `var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 10px 25px -3px rgb(${shadowColor}), 0 -2px 10px 0px rgb(${shadowColor}), 0 4px 6px -4px rgb(${shadowColor})`,
            }}
          />
        );
      })}
    </>
  );
}
