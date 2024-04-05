'use client';

import React from 'react';
import { mergeCls } from '@/utils';
import { useScroll } from '@/components/scroll2/ScrollPrimitive';

export type BulletIndicatorProps = {
  active: boolean;
  index: number;
};

export const BulletIndicator = React.forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button'] & BulletIndicatorProps
>(function (props, ref) {
  const { index, active, className, ...rest } = props;
  return (
    <button
      ref={ref}
      data-index={index}
      className={mergeCls(
        'h-2 w-2 rounded-md bg-paper_2 transition-colors',
        active && 'bg-white/60',
        className
      )}
      {...rest}
    />
  );
});

export type ScrollBulletIndicatorProps = {
  index: number;
};
export function ScrollBulletIndicator(props: ScrollBulletIndicatorProps) {
  const { index } = props;
  const { entries, scrollToIndex } = useScroll();
  const isActive = entries[index]?.intersectionRatio > 0.5;

  return <BulletIndicator index={index} active={isActive} onClick={scrollToIndex} />;
}
