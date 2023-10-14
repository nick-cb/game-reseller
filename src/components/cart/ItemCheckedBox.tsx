"use client";

import { useCartContext } from "@/components/cart/CartContext";
import { Game } from "@/database/models";
import { useLayoutEffect, useRef, useState } from "react";

export function ItemCheckBox({
  item,
}: {
  item: Pick<Game, "ID" | "sale_price">;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(true);
  const { changeSelectGame } = useCartContext();

  useLayoutEffect(() => {
    changeSelectGame(item, { toggle: false });
    const svg = ref.current;
    if (!svg) {
      return;
    }
    const rect1 = svg.children.item(0);
    const rect2 = svg.children.item(1);
    if (!rect1 || !rect2) {
      return;
    }
    rect1.animate([{ width: "calc(100% - 20px)" }], {
      duration: 500,
      easing: "linear",
      delay: 100,
      fill: "forwards",
    });
    rect2.animate([{ height: "calc(100% - 20px)" }], {
      duration: 300,
      easing: "linear",
      delay: 100,
      fill: "forwards",
    });
    rect1.animate([{ height: "calc(100% - 21px)" }], {
      duration: 300,
      easing: "linear",
      delay: 550,
      fill: "forwards",
    });
    rect2.animate([{ width: "calc(100% - 20px)" }], {
      duration: 500,
      easing: "linear",
      delay: 350,
      fill: "forwards",
    });
  }, []);

  return (
    <>
      <input
        checked={checked}
        type="checkbox"
        id={"checkbox-" + item.ID}
        className="h-5 w-5 peer absolute -left-2 -top-1 "
        onClick={() => {
          setChecked(!checked);
          changeSelectGame(item);
        }}
        onChange={() => {
          const svg = ref.current;
          if (!svg) {
            return;
          }
          const rect1 = svg.children.item(0);
          const rect2 = svg.children.item(1);
          if (!rect1 || !rect2) {
            return;
          }
          if (checked) {
            rect1.animate([{ height: "2px" }], {
              duration: 300,
              easing: "linear",
              fill: "forwards",
            });
            rect2.animate([{ width: "2px" }], {
              duration: 500,
              easing: "linear",
              fill: "forwards",
            });
            rect1.animate([{ width: 0 }], {
              duration: 500,
              delay: 250,
              easing: "linear",
              fill: "forwards",
            });
            rect2.animate([{ height: 0 }], {
              duration: 300,
              delay: 450,
              easing: "linear",
              fill: "forwards",
            });
            return;
          }
          rect1.animate([{ width: "calc(100% - 20px)" }], {
            duration: 500,
            easing: "linear",
            delay: 100,
            fill: "forwards",
          });
          rect2.animate([{ height: "calc(100% - 20px)" }], {
            duration: 300,
            easing: "linear",
            delay: 100,
            fill: "forwards",
          });
          rect1.animate([{ height: "calc(100% - 21px)" }], {
            duration: 300,
            easing: "linear",
            delay: 550,
            fill: "forwards",
          });
          rect2.animate([{ width: "calc(100% - 20px)" }], {
            duration: 500,
            easing: "linear",
            delay: 350,
            fill: "forwards",
          });
        }}
      />
      <label
        htmlFor={"checkbox-" + item.ID}
        className={
          "bg-paper h-5 w-5 absolute -left-2 -top-1 inset-0 rounded " +
          " outline outline-2 outline-default " +
          " after:absolute after:rounded after:inset-0 hover:after:bg-white_primary/25 after:transition-colors " +
          " active:animate-[btn-default-scale-animation_150ms] peer-active:animate-[btn-default-scale-animation_150ms] " +
          " [--scale:_0.9] absolute -left-2 -top-1 " +
          " [&>svg]:peer-checked:opacity-100 [&>svg]:peer-checked:delay-0 " +
          " [&>svg]:delay-[700ms] " +
          " peer-checked:shadow-inner peer-checked:shadow-white_primary/25 " +
          " peer-checked:[--tw-shadow-colored:_inset_0_1px_2px_1px_var(--tw-shadow-color)] "
        }
      >
        <svg
          className={
            "absolute w-[calc(100%+10px)] h-[calc(100%+10px)] inset-[-5px] " +
            " opacity-0 pointer-events-none transition-opacity duration-150 "
          }
        >
          <rect
            rx={0.35}
            pathLength={100}
            strokeDasharray={"0px 30.2px 28.8px 30px"}
            className="w-full h-full fill-transparent stroke-3 stroke-[#9c9c9c] [rx:0.35rem] [x:_-3px] [y:_-3px]"
            vectorEffect={"non-scaling-stroke"}
          />
        </svg>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="26px"
          height="26px"
          viewBox="0,0,256,256"
          className={"checkbox animated -translate-x-[3px] -translate-y-[3px] "}
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
              <path d="M14.5,25.5l6,6l14,-14" className="svg-elem-3"></path>
            </g>
          </g>
        </svg>
      </label>
      <div
        className={
          "absolute w-[calc(100%+20px)] h-[calc(100%+20px)] inset-[-10px] z-[-1] pointer-events-none "
        }
        ref={ref}
      >
        <div
          className={
            "w-0 h-[2px] fill-transparent absolute " +
            " translate-x-[10px] translate-y-[10px] z-[-1] [rx:0.25rem] opacity-100 " +
            " outline outline-1 outline-[#9c9c9c] rounded "
          }
        />
        <div
          className={
            "w-[2px] h-0 fill-transparent absolute " +
            " translate-x-[10px] translate-y-[10px] z-[-1] [rx:0.25rem] opacity-100 " +
            " outline outline-1 outline-[#9c9c9c] rounded "
          }
        />
      </div>
    </>
  );
}
