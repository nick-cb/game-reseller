import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useRef,
} from "react";

const AnimatedSizeContext = createContext<{
  container: HTMLElement | undefined;
  updateSize: (element: HTMLElement, width: number, height: number) => void;
}>({ container: undefined, updateSize: () => {} });
export const AnimatedSizeProvider = React.forwardRef(function <
  C extends keyof JSX.IntrinsicElements
>(
  {
    as,
    onStartAnimate,
    ...props
  }: {
    as: C;
    onStartAnimate?: (
      element: HTMLElement,
      prev: { element: HTMLElement | null; width: number; height: number },
      next: { element: HTMLElement | null; width: number; height: number }
    ) => void;
  } & JSX.IntrinsicElements[C],
  ref: JSX.IntrinsicElements[C]["ref"]
) {
  const activeElRef = useRef<{
    element: HTMLElement | null;
    width: number;
    height: number;
  }>({
    element: null,
    width: 0,
    height: 0,
  });
  const _ref = useRef<any>(null);
  const componentRef = ref || _ref;
  const Component = typeof as === "string" ? `${as}` : as;
  const updateSize = async (
    element: HTMLElement,
    width: number,
    height: number
  ) => {
    console.log("RUN");
    // @ts-ignore
    const current = componentRef.current;
    if (!current) {
      return;
    }
    onStartAnimate?.(current, activeElRef.current, { element, width, height });
    Object.assign(activeElRef.current, { element, width, height });
    current.animate(
      [
        {
          width: `${width}px`,
          height: `${height}px`,
        },
      ],
      {
        duration: 150,
        easing: "ease-out",
        fill: "forwards",
      }
    );

    // await ani.finished;
    // ani.commitStyle();
  };

  return (
    <AnimatedSizeContext.Provider
      // @ts-ignore
      value={{ container: componentRef.current, updateSize }}
    >
      <Component {...props} ref={componentRef} />
    </AnimatedSizeContext.Provider>
  );
});

export const AnimatedSizeItem = function ({
  children,
  active,
  className = "",
  updateOnInactive = false,
  ...props
}: { active: boolean; updateOnInactive?: boolean } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const { updateSize } = useContext(AnimatedSizeContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = ref.current;
    if (current && active) {
      const { width, height } = current.getBoundingClientRect();
      console.log({current, width, height});
      updateSize(current, width, height);
    }

    return () => {
      if (updateOnInactive) {
        updateSize(current, 0, 0);
      }
    };
  }, [active, updateOnInactive]);

  return (
    <div ref={ref} className={" " + className} {...props}>
      {children}
    </div>
  );
};
