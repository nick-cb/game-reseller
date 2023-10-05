"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";

const RadioGroupContext = createContext<{
  selected: string | null;
  changeSelected: (newSelected: string) => void;
}>({ selected: null, changeSelected: () => {} });

export function RadioGroup({
  toggleAble,
  children,
}: PropsWithChildren<{ toggleAble: boolean }>) {
  const [selected, setSelected] = useState<string | null>(null);
  const changeSelected = (newSelected: string | null) => {
    setSelected(() => {
      if (toggleAble && selected === newSelected) {
        return null;
      }
      return newSelected;
    });
  };

  return (
    <RadioGroupContext.Provider
      value={{
        selected,
        changeSelected,
      }}
    >
      {children}
    </RadioGroupContext.Provider>
  );
}

export function useRadio() {
  const value = useContext(RadioGroupContext);

  return value;
}
