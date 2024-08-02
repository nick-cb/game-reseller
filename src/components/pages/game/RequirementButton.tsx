'use client';

import { useScroll } from '@/components/scroll/ScrollPrimitive';
import { mergeCls } from '@/utils';

type RequirementButtonProps = {
  index: number;
  system: any;
};
export default function RequirementButton({ index, system }: RequirementButtonProps) {
  const { entries, scrollToIndex } = useScroll();
  const isActive = entries[index]?.isIntersecting;

  return (
    <button
      data-index={index}
      className={mergeCls(
        'rounded-t border-b-[3px] px-2 py-7 text-sm font-bold uppercase transition-colors',
        isActive ? 'border-b-white' : 'border-b-paper  hover:border-b-white/60'
      )}
      onClick={scrollToIndex}
    >
      <label className="whitespace-nowrap">{system.os}</label>
    </button>
  );
}
