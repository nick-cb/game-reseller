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
    animationOptions = {
      duration: 150,
      easing: "ease-out",
      fill: "forwards",
    },
    onStartAnimate,
    ...props
  }: {
    as: C;
    animationOptions?: number | KeyframeAnimationOptions | undefined;
    onStartAnimate?: (
      element: HTMLElement,
      prev: { element: HTMLElement | null; width: number; height: number },
      next: { element: HTMLElement | null; width: number; height: number }
    ) => void;
  } & JSX.IntrinsicElements[C],
  ref: JSX.IntrinsicElements[C]["ref"]
) {
  // duration: 150,
  // easing: "ease-out",
  // fill: "forwards",
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
      animationOptions
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

export const AnimatedSizeItem = React.memo(function ({
  children,
  active,
  className = "",
  updateOnInactive = false,
  delay,
  ...props
}: {
  active: boolean;
  updateOnInactive?: boolean;
  delay?: number;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const { updateSize } = useContext(AnimatedSizeContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = ref.current;
    if (current && active) {
      const { width, height } = current.getBoundingClientRect();
      // console.log({ current, width, height });
      if (!!delay) {
        setTimeout(() => {
          updateSize(current, width, height);
        }, delay);
      } else {
        updateSize(current, width, height);
      }
    }

    return () => {
      if (updateOnInactive) {
        updateSize(current, 0, 0);
      }
    };
  }, [active, updateOnInactive, delay]);

  useEffect(() => {
    console.log({ ref, active });
  }, [active]);

  useEffect(() => {
    console.log({ ref, updateOnInactive });
  }, [updateOnInactive]);

  useEffect(() => {
    console.log({ ref, delay });
  }, [delay]);

  return (
    <div ref={ref} className={" " + className} {...props}>
      {children}
    </div>
  );
});
