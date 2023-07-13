"use client";

import React from "react";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./snack.css";

export const SnackContext = createContext<{
  showMessage: (snack: Snack) => void;
}>({
  showMessage: () => {},
});
export type Snack = {
  message: string;
  type: "success" | "error" | "warning";
  timeout?: number;
};
export function SnackContextProvider({ children }: PropsWithChildren) {
  const [snackQueue, setSnackQueue] = useState<(Snack & { id: number })[]>([]);
  const showMessage = useCallback((snack: Snack) => {
    setSnackQueue((prev) => [
      ...prev,
      {
        ...snack,
        timeout: snack.timeout || 3000,
        id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 0,
      },
    ]);
  }, []);

  const shift = useCallback(() => {
    setSnackQueue((prev) => {
      prev.shift();
      return [...prev];
    });
  }, []);

  return (
    <SnackContext.Provider value={{ showMessage }}>
      <dialog
        open={snackQueue.length > 0}
        className="fixed mx-auto flex flex-col justify-start items-center 
        pointer-events-none bg-transparent w-full h-full z-50 
        backdrop:pointer-events-none
        gap-2"
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
  snack: Snack;
  onHide: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = ref.current?.animate(
      [
        { width: "0ch", opacity: 0 },
        { width: snack.message.length + 4 + "ch", opacity: 1 },
      ],
      {
        duration: 300,
        easing: "cubic-bezier(0.5, -0.3, 0.1, 1.5)",
        fill: "forwards",
      }
    );
    animation?.finished.then(() => {
      setTimeout(() => {
        animation.reverse();
        animation.finished.then(() => {
          onHide();
        });
      }, snack.timeout!);
    });
  }, []);

  return (
    <div
      ref={ref}
      className="bg-primary rounded text-white text-center py-2 shadow-md w-0 opacity-0"
    >
      {snack.message}
    </div>
  );
});
