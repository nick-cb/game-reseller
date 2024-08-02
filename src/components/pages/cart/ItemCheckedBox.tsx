'use client';

import { useOptimistic, useTransition } from 'react';
import { useCartContext } from './CartContext';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { mergeCls } from '@/utils';

export function ItemCheckBox({ index }: { index: number }) {
  const { gameList, changeSelectGame } = useCartContext();
  const item = gameList[index];
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(item.checked);
  const [updating, startUpdate] = useTransition();
  const router = useRouter();

  const onChange = async () => {
    if (updating) return;
    startUpdate(async () => {
      setOptimisticChecked(!optimisticChecked);
      await changeSelectGame({
        ID: item.ID,
        checked: item.checked,
        sale_price: item.sale_price,
      });
      router.refresh();
    });
  };

  return (
    <>
      <label
        id="cart-item-checkbox"
        className={mergeCls(
          'peer z-[1] grid rounded bg-paper outline outline-2 outline-default',
          'absolute -bottom-1 -right-2 block h-8 w-8 md:-left-2 md:-top-1 md:h-5 md:w-5',
          '[--scale:_0.9] active:animate-[btn-default-scale-animation_150ms_forwards]',
          'shadow-inner has-[:checked]:shadow-white_primary/10',
          '[--tw-shadow-colored:_inset_0_1px_2px_1px_var(--tw-shadow-color)]',
          'has-[:disabled]:bg-paper',
          'after:absolute after:inset-0 after:rounded after:transition-colors hover:after:bg-white_primary/25 has-[:disabled]:after:hidden has-[:focus]:after:bg-white_primary/25',
          'before:absolute before:inset-0 before:rounded before:outline before:outline-0 before:outline-offset-1 has-[:focus]:before:outline-1'
        )}
      >
        <input
          type="checkbox"
          checked={optimisticChecked}
          onChange={onChange}
          className="peer absolute -bottom-1 -right-2 z-[1] block h-8 w-8 md:-left-2 md:-top-1 md:h-5 md:w-5"
          style={{ gridArea: '1/1' }}
        />
        <Icon
          name="check"
          className="opacity-0 peer-checked:opacity-100"
          style={{ gridArea: '1/1', ...(updating ? { opacity: 0 } : {}) }}
        />
        {updating ? (
          <Icon name="loader-4" className="animate-spin" style={{ gridArea: '1/1' }} />
        ) : null}
      </label>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        <div className="absolute bottom-0 right-0 rounded border-b border-l border-[#9c9c9c] opacity-100 md:left-0 md:top-0 md:border-b-0 md:border-l-0 md:border-r md:border-t" />
        <div className="absolute bottom-0 right-0 rounded border-r border-t border-[#9c9c9c] opacity-100 md:left-0 md:top-0 md:border-b md:border-l md:border-r-0 md:border-t-0" />
      </div>
      <div
        className={mergeCls(
          'pointer-events-none absolute bottom-0 right-0 z-[1] peer-has-[:focus]:hidden md:left-0 md:top-0',
          'h-[calc(2rem_-_0.25rem_+_2px)] w-[calc(2rem_-_0.5rem_+_2px)]',
          'md:h-[calc(1.25rem_-_0.25rem_+_2px)] md:w-[calc(1.25rem_-_0.5rem_+_2px)]',
          'rounded-tl border-l border-t border-[#9c9c9c] md:rounded-br-md md:border-b md:border-l-0 md:border-r md:border-t-0'
        )}
      />
    </>
  );
}
