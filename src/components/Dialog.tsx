"use client";

import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import React, {
  DetailedHTMLProps,
  DialogHTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export const animationsComplete = (element: HTMLElement) =>
  Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished),
  );

const dialogContext = createContext<{
  dialogEl: React.RefObject<HTMLDialogElement> | null;
}>({ dialogEl: null });
export const Dialog = React.forwardRef<
  HTMLDialogElement,
  DetailedHTMLProps<
    DialogHTMLAttributes<HTMLDialogElement>,
    HTMLDialogElement
  > & {
    remountChild?: boolean;
    onOpening?: (event: Event) => void;
    onOpened?: (event: Event) => void;
  }
>(function (
  {
    className = "",
    children,
    remountChild,
    onOpened,
    onOpening,
    onClose,
    ...props
  },
  userRef,
) {
  const [visible, setVisible] = useState(!remountChild);
  const internalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(userRef, () => {
    return internalRef.current as HTMLDialogElement;
  });

  useEffect(() => {
    const dialog = internalRef.current;
    if (!dialog) {
      return;
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(async (mutation) => {
        if (mutation.attributeName === "open") {
          const dialog = mutation.target as HTMLDialogElement;

          const isOpen = dialog.hasAttribute("open");
          if (!isOpen) return;

          dialog.removeAttribute("inert");
          if (remountChild) {
            setVisible(true);
          }

          // set focus
          const focusTarget = dialog.querySelector("[autofocus]");
          focusTarget
            ? // @ts-ignore
              focusTarget.focus()
            : dialog.querySelector("button")?.focus();

          onOpening?.(new Event("opening"));
          await animationsComplete(dialog);
          onOpened?.(new Event("opened"));
        }
      });
    });

    observer.observe(dialog, {
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [remountChild]);

  return (
    <dialogContext.Provider value={{ dialogEl: internalRef }}>
      <dialog
        ref={internalRef}
        className={
          "grid bg-paper_2 rounded-lg shadow-lg shadow-black text-white_primary " +
          "overflow-x-hidden overflow-y-scroll scrollbar-hidden " +
          "inset-0 m-auto fixed " +
          "[&:not([open])]:opacity-0 [&:not([open])]:pointer-events-none " +
          "[&:not([open])]:p-0 " +
          "backdrop:backdrop-blur-xl backdrop-brightness-50 " +
          "[&:is([open])]:animate-[300ms_slide-in-down] [animation-fill-mode:_forwards] " +
          "[animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)] " +
          "animate-[300ms_scale-down_forwards] " +
          "transition-opacity " +
          className
        }
        onClose={async (event) => {
          const dialog = internalRef.current;
          if (!dialog) {
            return;
          }
          dialog.setAttribute("inert", "");
          await animationsComplete(dialog);
          if (remountChild) {
            setVisible(false);
          }
          return onClose?.(event);
        }}
        {...props}
      >
        {/* {visible ? children : null} */}
        <React.Fragment key={String(visible)}>{children}</React.Fragment>
      </dialog>
    </dialogContext.Provider>
  );
});

export function DialogContent<C extends keyof JSX.IntrinsicElements>({
  as,
  closeOnClickOutside = true,
  ...props
}: {
  as: C;
  closeOnClickOutside?: boolean;
} & JSX.IntrinsicElements[C]) {
  const Component = typeof as === "string" ? `${as}` : as;
  const { dialogEl } = useContext(dialogContext);
  const contentContainerRef = useClickOutsideCallback<any>(() => {
    const dialog = dialogEl?.current;
    if (!dialog) {
      return;
    }
    const isOpen = dialog?.hasAttribute("open");
    if (isOpen) {
      dialog?.close();
    }
  });

  return <Component ref={contentContainerRef} {...props} />;
}
