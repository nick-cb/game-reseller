"use client";

import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { pascalCase } from "@/utils";
import { Scroll, ScrollItem } from "@/components/scroll/index";
import SearchIcon from "@/components/SearchIcon";
import PortraitGameCard from "@/components/PortraitGameCard";
import { Input } from "@/components/Input";
import { SearchbarContext } from "@/components/home/search/SearchBarProvider";
import { useBreakpoints } from "@/hooks/useBreakpoint";

export const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function ({ onChange, onFocus, onKeyDown, ...rest }, ref) {
  const searchContext = useContext(SearchbarContext);

  const _onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      searchContext.onChange?.(e);
      onChange?.(e);
    },
    [searchContext.onChange, onChange],
  );

  const _onFocus: React.FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      searchContext.onFocus?.(e);
      onFocus?.(e);
    },
    [searchContext.onFocus, onFocus],
  );

  const _onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      searchContext.onKeyDown?.(e);
      onKeyDown?.(e);
    },
    [searchContext.onKeyDown, onKeyDown],
  );

  return (
    <Input
      ref={ref}
      {...rest}
      onChange={_onChange}
      onFocus={_onFocus}
      onKeyDown={_onKeyDown}
    />
  );
});

export function DesktopSearchResult({
  className = "",
}: {
  className?: string;
}) {
  const { data, keyword, changeHeight } = useContext(SearchbarContext);
  return (
    <div
      className={`z-20 absolute w-[325px] right-0 rounded 
                    bg-paper_2 shadow-white/10 shadow-md overflow-hidden 
                    h-0 transition-[height] duration-400 ease-in-out ${className}`}
      ref={changeHeight}
    >
      {(data || []).slice(0, 5).map((item) => (
        <Link href={`/${item.slug}`} title={item.name}>
          <div
            className="py-2 flex gap-4 hover:brightness-105 px-2 rounded transition-colors duration-75 hover:bg-paper"
            key={item.ID}
          >
            <Image
              src={item.images.portrait.url}
              width={50}
              height={70}
              alt={`portrait image of ${item.name}`}
              className="rounded"
            />
            <div className="flex flex-col justify-between">
              <div className="overflow-hidden">
                <Scroll
                  containerSelector={
                    "#" + item.slug.replace("/", "-") + "-infinite-scroll-name"
                  }
                  infiniteScroll
                  observerOptions={{
                    threshold: 1,
                  }}
                >
                  <div
                    id={item.slug.replace("/", "-") + "-infinite-scroll-name"}
                    className="w-[250px] flex gap-8"
                  >
                    <ScrollItem
                      as="p"
                      className="text-sm text-white/70 whitespace-nowrap w-max"
                    >
                      {item.name}
                    </ScrollItem>
                  </div>
                </Scroll>
                <p className="text-xs text-white/60 px-1 bg-paper relative w-max rounded after:rounded after:bg-white/[0.15] after:absolute after:inset-0">
                  {pascalCase(item.type, "_")}
                </p>
              </div>
              <p className="text-sm text-white_primary">đ{item.sale_price}</p>
            </div>
          </div>
        </Link>
      ))}
      {keyword && (data || []).length === 0 && (
        <p className="text-white/60 text-sm p-2">No game found</p>
      )}
    </div>
  );
}

export function MobileSearchModal({ children }: PropsWithChildren) {
  const { b640 } = useBreakpoints([640]);
  useParams();

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (b640 >= 0) {
      ref.current?.close();
    }
  }, [b640]);

  useEffect(() => {
    if (window.location.hash !== "#search" && ref.current?.open) {
      const header = document.querySelector("header");
      const nav = document.querySelector("nav");
      if (!header || !nav) {
        return;
      }
      header.animate(
        [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
        {
          duration: 200,
          easing: "ease-in-out",
        },
      );
      nav.animate(
        [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
        {
          duration: 200,
          easing: "ease-in-out",
        },
      );
      const animation = ref.current?.animate(
        [{ transform: "translateY(100%)" }],
        {
          duration: 400,
          easing: "ease-out",
          fill: "forwards",
        },
      );
      const animation2 = ref.current?.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        },
      );
      animation.finished.then(() => {
        ref.current?.close();
        animation.cancel();
        animation2.cancel();
      });
    }
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          window.location.hash = "#search";
          const header = document.querySelector("header");
          const nav = document.querySelector("nav");
          if (!header || !nav) {
            return;
          }
          ref.current?.showModal();
          header.animate([{ transform: "translateY(-100%)" }], {
            duration: 400,
            easing: "ease-in-out",
          });
          nav.animate([{ transform: "translateY(-100%)" }], {
            duration: 400,
            easing: "ease-in-out",
          });
        }}
        className="rounded h-10 w-full bg-paper_2 flex items-center px-2"
      >
        <SearchIcon />
      </button>
      <dialog
        ref={ref}
        className={
          "bg-default shadow-lg shadow-black text-white_primary p-0 overflow-hidden " +
          " m-0 inset-0 max-h-[unset] max-w-[unset] w-full h-full  " +
          "animate-[300ms_scale-in-up,_200ms_fade-in] [animation-fill-mode:_forwards] " +
          "[animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)] p-2 "
        }
      >
        {children}
      </dialog>
    </>
  );
}

export function MobileSearchResult() {
  const { data } = useContext(SearchbarContext);
  return (
    <>
      <div className="grid grid-cols-2 gap-4 overflow-scroll h-screen pb-32">
        {data.map((game) => {
          return <PortraitGameCard key={game.ID} game={game} />;
        })}
        {data.map((game) => {
          return <PortraitGameCard key={game.ID} game={game} />;
        })}
      </div>
      {data.length}
    </>
  );
}
