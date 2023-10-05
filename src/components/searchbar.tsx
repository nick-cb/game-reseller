"use client";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import SearchIcon from "./SearchIcon";
import SpinnerIcon from "./SpinnerIcon";
import Link from "next/link";
import { useCallback } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Input } from "./Input";
import { Game, GameImageGroup, GameImages } from "@/database/models";
import { OmitGameId } from "@/database/repository/game/select";
import { RowDataPacket } from "mysql2";
import { groupImages } from "@/utils/data";
import Scroll, { Item } from "./Scroll";
import { pascalCase } from "@/utils";
import PortraitGameCard from "./PortraitGameCard";
import { headers } from "next/headers";
import { BASE_URL } from "@/utils/config";

type SearchbarData = (RowDataPacket &
  Game & {
    images: ReturnType<typeof groupImages>;
  })[];
const SearchbarContext = createContext<{
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  data: SearchbarData;
  keyword: string | null;
  changeHeight?: (current: HTMLDivElement | null) => void;
}>({
  data: [],
  keyword: "",
  onChange: () => {},
  onFocus: () => {},
  onKeyDown: () => {},
  changeHeight: () => {},
});

const Searchbar = ({
  children,
  className = "",
  SearchResultSlot,
}: PropsWithChildren<{
  SearchResultSlot: typeof SearchResult;
  className?: string;
}>) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string | null>(null);
  const { isLoading, data: { data } = { data: [] } } = useQuery(
    ["search-by-keyword", keyword],
    () =>
      fetch(`${BASE_URL}/api/search?keyword=${keyword}`).then(
        (res) =>
          res.json() as Promise<{
            data: (RowDataPacket &
              Game & {images: GameImageGroup })[];
          }>,
      ),
    { enabled: Boolean(keyword) },
  );

  const searchResultContainerRef = useRef<HTMLDivElement>(null);
  const changeHeight = useCallback(
    (current: HTMLDivElement | null) => {
      // @ts-ignore
      searchResultContainerRef.current = current;
      if (!current) {
        return;
      }

      const height = (data.slice(0, 5) || []).length * 92;
      current.style.height = (height > 0 ? height - 8 : 0) + "px";
      if (keyword && (data || []).length === 0) {
        current.style.height = "36px";
      }
    },
    [data],
  );

  const ref = useClickOutsideCallback<HTMLDivElement>(() => {
    if (!searchResultContainerRef.current) {
      return;
    }
    if (searchResultContainerRef.current?.style.height !== "0px") {
      searchResultContainerRef.current.style.height = "0px";
      return;
    }
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const onFocus = () => {
    changeHeight(searchResultContainerRef.current);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/browse?keyword=${keyword}`);
    }
  };

  return (
    <SearchbarContext.Provider
      value={{
        data,
        keyword,
        changeHeight,
        onChange,
        onFocus,
        onKeyDown,
      }}
    >
      <div className={"relative h-full " + className} ref={ref}>
        <div
          className={`flex items-center rounded pl-4 pr-2 h-full 
                    bg-white/[0.15] hover:bg-white/[0.25] 
                    transition-colors`}
        >
          <SearchIcon />
          {children}
          <SpinnerIcon className="ml-auto" isLoading={isLoading} />
        </div>
        <SearchResultSlot
          className={""}
          data={data}
          keyword={keyword}
          changeHeight={changeHeight}
        />
      </div>
    </SearchbarContext.Provider>
  );
};

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

export function SearchResult({
  className,
  data,
  keyword,
  changeHeight,
}: {
  className: string;
  data: SearchbarData;
  keyword: string | null;
  changeHeight: (current: HTMLDivElement | null) => void;
}) {
  return (
    <div
      className={`z-20 absolute w-[250px] right-0 rounded 
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
                    className="w-40 flex gap-8"
                  >
                    <Item
                      as="p"
                      className="text-sm text-white/70 whitespace-nowrap w-max"
                    >
                      {item.name}
                    </Item>
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

export function SearchbarDistributeTop() {
  return (
    <Searchbar SearchResultSlot={SearchResult}>
      <SearchInput
        className={
          " px-2 py-2 border-0 outline-offset-0 outline-0 " +
          " bg-transparent text-sm text-white " +
          " !w-[12ch] focus:!w-[20ch] transition-[width] ease-in-out duration-300 ${className} "
        }
        placeholder="Search..."
      />
    </Searchbar>
  );
}

export function SearchbarDistributeBottom() {
  const SearchResultSlot: typeof SearchResult = useCallback(
    ({ className, ...props }) => (
      <SearchResult {...props} className={"bottom-14 w-full " + className} />
    ),
    [],
  );

  return (
    <>
      <Searchbar SearchResultSlot={SearchResultSlot}>
        <SearchInput
          className={
            "!text-base h-10 " +
            " px-2 py-2 border-0 outline-offset-0 outline-0 " +
            " text-sm text-white " +
            " w-full focus:w-full"
          }
        />
      </Searchbar>
    </>
  );
}

export function MobileSearch() {
  useParams();

  const [keyword, setKeyword] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const { data: { data: placeholderData } = { data: [] } } = useQuery(
    ["search-placeholder-data"],
    async () => {
      return await fetch(
        `${BASE_URL}/api/placeholder`,
      ).then(
        (res) =>
          res.json() as Promise<{
            data: (Game & GameImageGroup)[];
          }>,
      );
    },
  );
  const { isLoading, data: { data } = { data: [] } } = useQuery(
    ["search-by-keyword", keyword],
    () =>
      fetch(`${BASE_URL}/api/search?keyword=${keyword}`).then(
        (res) =>
          res.json() as Promise<{
            data: (RowDataPacket &
              Game & {
                images: OmitGameId<GameImages>[];
              })[];
          }>,
      ),
    { enabled: Boolean(keyword) },
  );

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

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
        <div className="bg-paper px-2 py-1 rounded flex gap-2 items-center">
          <SearchIcon />
          <SearchbarContext.Provider value={{
            data: [],
            keyword,
            onChange,
          }}>
            <SearchInput className="w-full "  />
          </SearchbarContext.Provider>

        </div>
        <div className="my-4"></div>
        <div className="grid grid-cols-2 gap-4 overflow-scroll h-screen pb-32">
          {data.map((game) => {
            return <PortraitGameCard key={game.ID} game={game} />;
          })}
          {!data.length ? placeholderData.map((game) => {
            return <PortraitGameCard key={game.ID} game={game} />;
          }) : null}
        </div>
        {placeholderData.length}
      </dialog>
    </>
  );
}

export default Searchbar;
