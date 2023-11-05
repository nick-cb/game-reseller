"use client";

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { RowDataPacket } from "mysql2/index";
import { Game, GameImageGroup } from "@/database/models";
import { groupImages } from "@/utils/data";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { BASE_URL } from "@/utils/config";
import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import SearchIcon from "@/components/SearchIcon";
import SpinnerIcon from "@/components/SpinnerIcon";

export type SearchbarData = (RowDataPacket &
  Game & {
    images: ReturnType<typeof groupImages>;
  })[];
export const SearchbarContext = createContext<{
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
export const SearchbarProvider = ({
  children,
  className = "",
  defaultData = [],
  SearchResultSlot,
}: PropsWithChildren<{
  className?: string;
  defaultData?: any[];
  SearchResultSlot: React.ReactNode;
}>) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string | null>(null);
  const { isLoading, data: { data } = { data: defaultData } } = useQuery(
    ["search-by-keyword", keyword],
    () =>
      fetch(`${BASE_URL}/api/search?keyword=${keyword}`).then(
        (res) =>
          res.json() as Promise<{
            data: (RowDataPacket & Game & { images: GameImageGroup })[];
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
        {SearchResultSlot}
      </div>
    </SearchbarContext.Provider>
  );
};
export default SearchbarProvider;
