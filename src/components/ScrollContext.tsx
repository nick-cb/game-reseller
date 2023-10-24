"use client";

import {
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

const scrollContext = createContext<{
  radioButtonGroupRef: RefObject<HTMLUListElement>;
  radioContentGroupRef: RefObject<HTMLUListElement>;
}>({
  radioButtonGroupRef: { current: null },
  radioContentGroupRef: { current: null },
});

export function ScrollProvider() {
  const radioButtonGroupRef = useRef<HTMLUListElement>(null);
  const radioContentGroupRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const radioButtonGroup = radioButtonGroupRef.current;
    const radioContentGroup = radioContentGroupRef.current;
    if (!radioButtonGroup || !radioContentGroup) {
      return;
    }

    const radioButtonItems = radioButtonGroup.children;
    const radioContentItems = radioContentGroup.children;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLLIElement;
          const index = parseInt(target.dataset["index"] || "");
          if (isNaN(index)) {
            continue;
          }
          if (entry.intersectionRatio >= 0.5) {
            radioButtonItems.item(index)?.classList.add("!border-primary");
          } else {
            radioButtonItems.item(index)?.classList.remove("!border-primary");
          }
        }
      },
      {
        root: radioContentGroup,
        threshold: 0.5,
      }
    );

    for (const item of radioContentItems) {
      observer.observe(item);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
}

export function ObserveElement<C extends keyof JSX.IntrinsicElements>({
  children,
  as,
  ...props
}: PropsWithChildren<{
  as: C;
}> &
  JSX.IntrinsicElements[C]) {
  const { radioContentGroupRef } = useContext(scrollContext);
  const Component = typeof as === "string" ? `${as}` : as;

  // @ts-ignore
  return <Component {...props} ref={radioContentGroupRef}>{children}</Component>;
}
