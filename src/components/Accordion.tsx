"use client";

import React from "react";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type AccordionGroupContextProps = {
  activeIndex: number[];
  toggle: ({ index }: { index: number }) => void;
};
const AccordionGroupContext = createContext<AccordionGroupContextProps>({
  activeIndex: [],
  toggle: () => {},
});
export function AccordionGroup({
  children,
  exclusive = false,
  defaultValue = [],
}: PropsWithChildren<{
  exclusive?: boolean;
  defaultValue?: number | number[];
}>) {
  const [activeIndex, setActiveIndex] = useState<number[]>(
    typeof defaultValue === "number" ? [defaultValue] : defaultValue,
  );

  const toggleActive: AccordionGroupContextProps["toggle"] = ({ index }) => {
    setActiveIndex(() => {
      if (exclusive) {
        // if (activeIndex[0] === index) {
        //   return [];
        // } else {
        return [index];
        // }
      }
      if (activeIndex.includes(index)) {
        const newIndexes = activeIndex.filter((item) => item !== index);
        return [...newIndexes];
      }
      return [...activeIndex, index];
    });
  };

  return (
    <AccordionGroupContext.Provider
      value={{
        activeIndex,
        toggle: toggleActive,
      }}
    >
      {children}
    </AccordionGroupContext.Provider>
  );
}

type AccordionContextProps = {
  index: number;
};
const AccordionContext = createContext<AccordionContextProps>({
  index: -1,
});
export function Accordion({
  children,
  index,
}: PropsWithChildren<{ index: number }>) {
  return (
    <AccordionContext.Provider value={{ index }}>
      {children}
    </AccordionContext.Provider>
  );
}

export function AccordionHeader({
  children,
  className = "",
  onClick,
  ...rest
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const { index } = useContext(AccordionContext);
  const { toggle } = useContext(AccordionGroupContext);

  return (
    <h3>
      <button
        type="button"
        onClick={(event) => {
          toggle({ index });
          onClick?.(event);
        }}
        className={"w-full h-full flex justify-start " + className}
        {...rest}
      >
        {children}
      </button>
    </h3>
  );
}

export function AccordionBody({
  children,
  remountChild,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  remountChild?: boolean;
}) {
  const { index } = useContext(AccordionContext);
  const { activeIndex } = useContext(AccordionGroupContext);
  const hidden = !activeIndex.includes(index);

  return (
    <div hidden={hidden} {...props}>
      {remountChild && hidden ? null : children}
    </div>
  );
}
