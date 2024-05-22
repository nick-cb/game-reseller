'use client';

import React, { createContext, startTransition, useRef, useState } from 'react';
import { mergeCls } from '@/utils';
import { Strategy } from '@/components/pages/auth/LoginView';

const context = createContext({
  selected: 'no-strategy' as Strategy,
  changeStrategy: (_: React.MouseEvent<HTMLButtonElement>) => {},
});

export function StrategyLayout(props: React.PropsWithChildren) {
  const { children } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Strategy>('no-strategy');
  const changeStrategy = (event: React.MouseEvent<HTMLButtonElement>) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const strategy = event.currentTarget.dataset.buttonStrategy;
    startTransition(() => {
      setSelected(strategy as any);
    });
    const currentStrat = container.querySelector('[data-active="true"]');
    const nextStrat = container.querySelector(`[data-strategy="${strategy}"]`);
    const containerRect = container.getBoundingClientRect();
    const currentStratRec = currentStrat?.getBoundingClientRect();
    const nextStratRec = nextStrat?.getBoundingClientRect();
    const width = containerRect.width - (currentStratRec?.width ?? 0) + (nextStratRec?.width ?? 0);
    const heigh =
      containerRect.height - (currentStratRec?.height ?? 0) + (nextStratRec?.height ?? 0);
    container.animate(
      [
        { width: containerRect.width + 'px', height: containerRect.height + 'px' },
        { width: width + 'px', height: heigh + 'px' },
      ],
      {
        duration: 150,
        easing: 'ease-in-out',
      }
    );
    currentStrat?.animate(
      [
        { transform: 'translateX(0px)', opacity: 1 },
        { transform: 'translateX(-100%)', opacity: 0 },
      ],
      { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
    );
    nextStrat?.animate(
      [
        { transform: 'translateX(100%)', opacity: 0 },
        { transform: 'translateX(0px)', opacity: 1 },
      ],
      { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
    );
  };

  return (
    <context.Provider
      value={{
        selected,
        changeStrategy,
      }}
    >
      <div ref={containerRef} className={'relative grid transition-all duration-300'}>
        {children}
      </div>
    </context.Provider>
  );
}

export function useStrategyLayout() {
  return React.useContext(context);
}

export function GobackButton() {
  const { changeStrategy } = useStrategyLayout();
  return (
    <button
      data-button-strategy="no-strategy"
      onClick={changeStrategy}
      className={mergeCls(
        'mt-4 w-full rounded border border-white/60 py-2 text-sm transition-colors hover:bg-white/25'
      )}
    >
      Go back
    </button>
  );
}

type StrategyItemProps = JSX.IntrinsicElements['div'] & {
  strategy: Strategy;
};

export function StrategyItem(props: StrategyItemProps) {
  const { className, strategy, ...rest } = props;
  const { selected } = useStrategyLayout();

  return (
    <div
      data-strategy={strategy}
      data-active={selected === strategy}
      className={mergeCls(
        className,
        selected === strategy ? 'opacity-100' : 'pointer-events-none opacity-0',
        selected !== strategy && 'absolute'
      )}
      {...rest}
    />
  );
}

