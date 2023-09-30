"use client";

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
}: PropsWithChildren<{
  exclusive?: boolean;
}>) {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  const toggleActive: AccordionGroupContextProps["toggle"] = ({ index }) => {
    setActiveIndex(() => {
      if (exclusive) {
        if (activeIndex[0] === index) {
          return [];
        } else {
          return [index];
        }
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
        {...rest}
      >
        {children}
      </button>
    </h3>
  );
}

export function AccordionBody({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const { index } = useContext(AccordionContext);
  const { activeIndex } = useContext(AccordionGroupContext);

  return (
    <div hidden={!activeIndex.includes(index)} {...props}>
      {children}
    </div>
  );
}
