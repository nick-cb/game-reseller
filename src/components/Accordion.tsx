"use client";

import {
  DetailedHTMLProps,
  PropsWithChildren,
  ButtonHTMLAttributes,
  useState,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import { AnimatedSizeItem, AnimatedSizeProvider } from "./AnimatedSizeProvider";

const AccordionContext2 = createContext<{
  active: HTMLElement | null;
  subsribe: (element: HTMLElement) => void;
  open: (element: HTMLElement) => void;
}>({
  active: null,
  subsribe: () => {},
  open: () => {},
});

export default function Accordion({ children }: PropsWithChildren) {
  const accordionList = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState<HTMLElement | null>(null);

  const subsribe = useCallback((element: HTMLElement) => {
    accordionList.current.push(element);
  }, []);

  const open = useCallback(
    (element: HTMLElement) => {
      if (active?.isSameNode(element)) {
        setActive(element);
      }
    },
    [active]
  );

  return (
    <AccordionContext2.Provider value={{ active, subsribe, open }}>
      {children}
    </AccordionContext2.Provider>
  );
}

const AccordionContext = createContext<{
  expanded: boolean;
}>({
  expanded: false,
});
export function AccordionItem({
  children,
  expanded,
}: PropsWithChildren<{ expanded: boolean }>) {
  return (
    <AccordionContext.Provider value={{ expanded }}>
      <div className={"bg-paper_2 " + (expanded ? " shadow-md shadow-black" : "")}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionHeader({
  children,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const { expanded } = useContext(AccordionContext);

  return (
    <h3
      className="text-lg relative
      after:bg-white/[0.10] after:absolute after:inset-0 
      after:opacity-0 hover:after:opacity-100 after:transition-opacity
      after:pointer-events-none"
      data-component={"collapsibles"}
      aria-expanded={expanded}
    >
      <button
        className={
          "flex justify-between items-center w-full py-4 px-6 " +
          (expanded ? "border-b border-white/25" : "")
        }
        {...props}
      >
        <div className="flex gap-4 items-center">{children}</div>
        <svg
          className="transition-transform"
          fill="transparent"
          stroke="white"
          width={24}
          height={24}
          style={{
            transform: expanded ? "rotateZ(180deg)" : "rotateZ(0deg)",
          }}
        >
          <use xlinkHref="/svg/sprites/actions.svg#chevron-down" />
        </svg>
      </button>
    </h3>
  );
}

export function AccordionBody({
  children,
  className = "",
  ...props
}: Omit<React.ComponentProps<typeof AnimatedSizeItem>, "active">) {
  const { expanded } = useContext(AccordionContext);

  return expanded ? (
    <AnimatedSizeProvider className={className} as={"div"}>
      {children}
    </AnimatedSizeProvider>
  ) : null;
}

export function AccordionSeparator({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={"bg-default px-2"}
      style={{
        height: !expanded ? 0 : 4,
      }}
    ></div>
  );
}

// {
//   expanded ? (
//     <AnimatedSizeItem
//       active={expanded}
//       aria-hidden={!expanded}
//       hidden={!expanded}
//       className={className}
//       {...props}
//     >
//       {children}
//     </AnimatedSizeItem>
//   ) : null;
// }
