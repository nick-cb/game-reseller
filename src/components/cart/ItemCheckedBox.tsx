"use client";

import { useCartContext } from "@/components/cart/CartContext";
import { Game } from "@/database/models";
import { useBreakpoints } from "@/hooks/useBreakpoint";
import { useLayoutEffect, useRef, useState } from "react";

const breakpoints = [780] as const;
export function ItemCheckBox({
  item,
}: {
  item: Pick<Game, "ID" | "sale_price">;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(true);
  const { changeSelectGame } = useCartContext();
  const { b780 } = useBreakpoints(breakpoints);

  const animationDuration = b780
    ? b780 >= 0
      ? {
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
        }
      : {
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
        }
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
    rect1.animate([{ width: "calc(100% - 20px)" }], {
      ...animationDuration?.rect1.in.width,
      easing: "linear",
      fill: "forwards",
    });
    rect2.animate([{ height: "calc(100% - 20px)" }], {
      // duration: 300,
      // delay: 100,
      ...animationDuration?.rect2.in.height,
      easing: "linear",
      fill: "forwards",
    });
    rect1.animate([{ height: "calc(100% - 21px)" }], {
      // duration: 300,
      // delay: 550,
      ...animationDuration?.rect1.in.height,
      easing: "linear",
      fill: "forwards",
    });
    rect2.animate([{ width: "calc(100% - 20px)" }], {
      // duration: 500,
      // delay: 350,
      ...animationDuration?.rect2.in.width,
      easing: "linear",
      fill: "forwards",
    });
  }, []);

  return (
    <>
      <>
        <input
          checked={checked}
          type="checkbox"
          id={"checkbox-" + item.ID}
          className="h-5 w-5 peer absolute -bottom-1 -right-2 md:-left-2 md:-top-1 "
          onClick={() => {
            setChecked(!checked);
            changeSelectGame(item);
          }}
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
            if (checked) {
              // Apply style from previous animations and cancel them
              // because it seem like safari can't do this itself
              // TODO: Detect userAgent is bad, fix this later
              if (navigator.userAgent.indexOf("Safari") > -1) {
                rect1.getAnimations().forEach((animation) => {
                  animation.commitStyles();
                  animation.cancel();
                });
              }
              rect2.getAnimations().forEach((animation) => {
                animation.commitStyles();
                animation.cancel();
              });
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
            "bg-paper w-8 h-8 md:h-5 md:w-5 absolute block -bottom-1 -right-2 md:-left-2 md:-top-1 rounded " +
            " outline outline-2 outline-default " +
            " after:absolute after:rounded after:inset-0 hover:after:bg-white_primary/25 after:transition-colors " +
            " active:animate-[btn-default-scale-animation_150ms] peer-active:animate-[btn-default-scale-animation_150ms] " +
            " [--scale:_0.9] " +
            " [&>svg]:peer-checked:opacity-100 [&>svg]:peer-checked:delay-0 " +
            " [&>svg]:delay-[550ms] md:[&>svg]:delay-[700ms] " +
            " peer-checked:shadow-inner peer-checked:shadow-white_primary/25 " +
            " peer-checked:[--tw-shadow-colored:_inset_0_1px_2px_1px_var(--tw-shadow-color)] "
          }
        >
          {b780 ? (
            <>
              <svg
                className={
                  "absolute w-[calc(100%+10px)] h-[calc(100%+10px)] inset-[-5px] z-50 " +
                  " opacity-0 pointer-events-none transition-opacity duration-150 "
                }
              >
                <rect
                  rx={0.35}
                  pathLength={100}
                  strokeDasharray={
                    b780 >= 0 ? "0px 29.8px 28.8px 30px" : "13.6px 50px 1.7px"
                  }
                  className="w-full h-full fill-transparent stroke-3 stroke-[#9c9c9c] [rx:0.35rem] [x:3px] [y:3px] md:[x:-3px] md:[y:-3px]"
                  vectorEffect={"non-scaling-stroke"}
                />
              </svg>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width={b780 >= 0 ? "26px" : "32px"}
                height={b780 >= 0 ? "26px" : "32px"}
                viewBox="0,0,256,256"
                className={
                  "checkbox animated md:-translate-x-[3px] md:-translate-y-[3px] "
                }
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
