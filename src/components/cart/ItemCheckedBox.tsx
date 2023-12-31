"use client";

import { useBreakpoints } from "@/hooks/useBreakpoint";
import {
  experimental_useOptimistic as useOptimistic,
  useLayoutEffect,
  useRef,
  useTransition,
} from "react";
import { LoadingIcon2 } from "../loading/LoadingIcon";
import { useCartContext } from "./CartContext";
import { useRouter } from "next/navigation";

const breakpoints = [780] as const;
export function ItemCheckBox({ index }: { index: number }) {
  const { gameList, changeSelectGame } = useCartContext();
  const item = gameList[index];
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(item.checked);
  const ref = useRef<HTMLDivElement>(null);
  const { b780 } = useBreakpoints(breakpoints);
  const [updating, startUpdate] = useTransition();
  const router = useRouter();

  const animationDuration = b780
    ? b780 >= 0
      ? animationMedium
      : animationMobile
    : null;

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    const rect1 = container.children.item(0);
    const rect2 = container.children.item(1);
    if (!rect1 || !rect2) {
      return;
    }
    if (item.checked) {
      if (navigator.userAgent.indexOf("Safari") > -1) {
        rect1.getAnimations().forEach((animation) => {
          animation.commitStyles();
          animation.cancel();
        });
        rect2.getAnimations().forEach((animation) => {
          animation.commitStyles();
          animation.cancel();
        });
      }
      rect1.animate([{ width: "calc(100% - 20px)" }], {
        ...animationDuration?.rect1.in.width,
        easing: "linear",
        fill: "forwards",
      });
      rect2.animate([{ height: "calc(100% - 20px)" }], {
        ...animationDuration?.rect2.in.height,
        easing: "linear",
        fill: "forwards",
      });
      rect1.animate([{ height: "calc(100% - 21px)" }], {
        ...animationDuration?.rect1.in.height,
        easing: "linear",
        fill: "forwards",
      });
      rect2.animate([{ width: "calc(100% - 20px)" }], {
        ...animationDuration?.rect2.in.width,
        easing: "linear",
        fill: "forwards",
      });
    }
  }, [item]);

  return (
    <>
      <>
        <input
          checked={optimisticChecked}
          type="checkbox"
          id={"checkbox-" + item.ID}
          className={
            "peer " +
            "w-8 h-8 md:h-5 md:w-5 absolute block -bottom-1 -right-2 md:-left-2 md:-top-1"
          }
          onClick={() => {
            setOptimisticChecked(!optimisticChecked);
            startUpdate(async () => {
              await changeSelectGame({
                ID: item.ID,
                checked: item.checked,
                sale_price: item.sale_price,
              });
              router.refresh();
            });
          }}
          disabled={updating}
          onChange={() => {
            const container = ref.current;
            if (!container) {
              return;
            }
            const rect1 = container.children.item(0);
            const rect2 = container.children.item(1);
            if (!rect1 || !rect2) {
              return;
            }
            if (optimisticChecked) {
              if (navigator.userAgent.indexOf("Safari") > -1) {
                rect1.getAnimations().forEach((animation) => {
                  // if (animation.id !== ani1.id && animation.id !== ani3.id) {
                  animation.commitStyles();
                  animation.cancel();
                  // }
                });
                rect2.getAnimations().forEach((animation) => {
                  // if (animation.id !== ani2.id && animation.id !== ani4.id) {
                  animation.commitStyles();
                  animation.cancel();
                  // }
                });
              }
              rect1.animate([{ height: "2px" }], {
                ...animationDuration?.rect1.out?.height,
                easing: "linear",
                fill: "forwards",
              });
              rect2.animate([{ width: "2px" }], {
                ...animationDuration?.rect2.out?.width,
                easing: "linear",
                fill: "forwards",
              });
              rect1.animate([{ width: 0 }], {
                ...animationDuration?.rect1.out?.width,
                easing: "linear",
                fill: "forwards",
              });
              rect2.animate([{ height: 0 }], {
                ...animationDuration?.rect2.out?.height,
                easing: "linear",
                fill: "forwards",
              });
              return;
            }
            rect1.animate([{ width: "calc(100% - 20px)" }], {
              ...animationDuration?.rect1?.in.width,
              easing: "linear",
              fill: "forwards",
            });
            rect2.animate([{ height: "calc(100% - 20px)" }], {
              ...animationDuration?.rect2.in?.height,
              easing: "linear",
              fill: "forwards",
            });
            rect1.animate([{ height: "calc(100% - 21px)" }], {
              ...animationDuration?.rect1?.in.height,
              easing: "linear",
              fill: "forwards",
            });
            rect2.animate([{ width: "calc(100% - 20px)" }], {
              ...animationDuration?.rect2?.in?.width,
              easing: "linear",
              fill: "forwards",
            });
          }}
        />
        <label
          htmlFor={"checkbox-" + item.ID}
          className={
            "flex justify-center items-center " +
            " bg-paper w-8 h-8 md:h-5 md:w-5 absolute block -bottom-1 -right-2 md:-left-2 md:-top-1 rounded " +
            " outline outline-2 outline-default " +
            (!updating
              ? " after:absolute after:rounded after:inset-0 hover:after:bg-white_primary/25 after:transition-colors "
              : "") +
            " active:animate-[btn-default-scale-animation_150ms] peer-active:animate-[btn-default-scale-animation_150ms] " +
            " [--scale:_0.9] " +
            " [&>div]:peer-checked:opacity-100 [&>div]:peer-checked:delay-0 " +
            " [&>div]:delay-[550ms] md:[&>div]:delay-[700ms] " +
            " peer-checked:shadow-inner peer-checked:shadow-white_primary/25 " +
            " peer-checked:[--tw-shadow-colored:_inset_0_1px_2px_1px_var(--tw-shadow-color)] " +
            " peer-disabled:bg-paper "
          }
        >
          {b780 ? (
            <>
              <div
                className={
                  "absolute h-[calc(100%-1px)] w-[calc(100%-5px)] border-[#9c9c9c] " +
                  " md:border-t-0 md:border-l-0 md:border-r md:border-b md:left-[unset] md:top-[unset] -right-[2px] -bottom-[2px] md:rounded-br-md " +
                  " border-t border-l -left-[2px] -top-[2px] rounded-tl-md " +
                  " opacity-0 pointer-events-none transition-opacity duration-150 "
                }
              ></div>
              {updating ? (
                <LoadingIcon2
                  width={18}
                  height={18}
                  fill="white"
                  stroke={"#9c9c9c"}
                  loading={true}
                />
              ) : null}
              {!updating ? (
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width={b780 >= 0 ? "26px" : "32px"}
                  height={b780 >= 0 ? "26px" : "32px"}
                  viewBox="0,0,256,256"
                  className={"checkbox animated "}
                  stroke="white"
                >
                  <g
                    fill="none"
                    fillRule="nonzero"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeDasharray=""
                    strokeDashoffset="0"
                    fontFamily="none"
                    fontWeight="none"
                    fontSize="none"
                    textAnchor="none"
                    style={{ mixBlendMode: "normal" }}
                  >
                    <g transform="scale(5.33333,5.33333)">
                      <path
                        d="M14.5,25.5l6,6l14,-14"
                        className="svg-elem-3"
                      ></path>
                    </g>
                  </g>
                </svg>
              ) : null}
            </>
          ) : null}
        </label>
      </>
      <div
        className={
          "absolute w-[calc(100%+20px)] h-[calc(100%+20px)] inset-[-10px] z-[-1] pointer-events-none "
        }
        ref={ref}
      >
        <div
          className={
            " w-0 h-[2px] z-[-1] [rx:0.25rem] opacity-100 " +
            " absolute bottom-0 right-0 md:bottom-auto md:right-auto " +
            " -translate-x-[10px] -translate-y-[10px] md:translate-x-[10px] md:translate-y-[10px] " +
            " outline outline-1 outline-[#9c9c9c] rounded "
          }
        />
        <div
          className={
            "w-[2px] h-0 " +
            " absolute bottom-0 right-0 md:bottom-auto md:right-auto " +
            " -translate-x-[10px] -translate-y-[10px] md:translate-x-[10px] md:translate-y-[10px] " +
            " outline outline-1 outline-[#9c9c9c] rounded "
          }
        />
      </div>
    </>
  );
}

const animationMedium = {
  rect1: {
    in: {
      width: {
        duration: 500,
        delay: 100,
      },
      height: {
        duration: 300,
        delay: 550,
      },
    },
    out: {
      height: {
        duration: 300,
      },
      width: {
        duration: 500,
        delay: 250,
      },
    },
  },
  rect2: {
    in: {
      width: {
        duration: 500,
        delay: 350,
      },
      height: {
        duration: 300,
        delay: 100,
      },
    },
    out: {
      height: {
        duration: 300,
        delay: 450,
      },
      width: {
        duration: 500,
      },
    },
  },
};
const animationMobile = {
  rect1: {
    in: {
      width: {
        duration: 300,
        delay: 100,
      },
      height: {
        duration: 300,
        delay: 350,
      },
    },
    out: {
      height: {
        duration: 300,
      },
      width: {
        duration: 300,
        delay: 250,
      },
    },
  },
  rect2: {
    in: {
      width: {
        duration: 300,
        delay: 350,
      },
      height: {
        duration: 300,
        delay: 100,
      },
    },
    out: {
      height: {
        duration: 300,
        delay: 250,
      },
      width: {
        duration: 300,
      },
    },
  },
};
