'use client';

import React from 'react';
import { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import './snack.css';
import { uuidv4 } from '@/utils';

export const SnackContext = createContext<{
  showMessage: (snack: Snack) => void;
}>({
  showMessage: () => {},
});
export type Snack = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
};
export function SnackContextProvider({ children }: PropsWithChildren) {
  const [snackQueue, setSnackQueue] = useState<(Snack & { id: string })[]>([]);
  const showMessage = useCallback((snack: Snack) => {
    setSnackQueue((prev) => [
      ...prev,
      {
        ...snack,
        timeout: snack.timeout || 5000,
        id: uuidv4(),
      },
    ]);
  }, []);

  const shift = useCallback((id: string) => {
    setSnackQueue((prev) => {
      const index = prev.findIndex((snack) => snack.id === id);
      if (index > -1) {
        prev.splice(index, 1);
      }
      return [...prev];
    });
  }, []);

  return (
    <SnackContext.Provider value={{ showMessage }}>
      <dialog
        open={snackQueue.length > 0}
        className="pointer-events-none fixed inset-0 z-50 mx-auto flex h-full w-full flex-col items-center justify-start gap-2 bg-transparent pt-[116px] backdrop:pointer-events-none"
      >
        {snackQueue.map((snack) => (
          <Snack key={snack.id} snack={snack} onHide={shift} />
        ))}
      </dialog>
      {children}
    </SnackContext.Provider>
  );
}

const Snack = React.memo(function ({
  snack,
  onHide,
}: {
  snack: Snack & { id: string };
  onHide: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = ref.current?.animate(
      [
        { width: '0ch', opacity: 0 },
        { width: snack.message.length + 4 + 'ch', opacity: 1 },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.5, -0.3, 0.1, 1.5)',
        fill: 'forwards',
      }
    );
    animation?.finished.then(() => {
      setTimeout(() => {
        animation.reverse();
        animation.finished.then(() => {
          onHide(snack.id);
        });
      }, snack.timeout!);
    });

    return () => {
      animation?.cancel();
    };
  }, [snack]);

  return (
    <div
      ref={ref}
      className="w-0 rounded bg-primary py-2 text-center text-white opacity-0 shadow-md"
      style={{
        background: colors[snack.type].bg,
      }}
    >
      {snack.message}
    </div>
  );
});

const colors = {
  warning: { bg: '#d97706' },
  info: { bg: 'hsl(209, 100%, 45%)' },
  error: { bg: '#dc2626' },
  success: { bg: '#059669' },
};
