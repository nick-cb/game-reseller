'use client';

import GameActions from '@/actions/games-actions';
import { Input } from '@/components/Input';
import Pagination from '@/components/Pagination';
import PortraitGameCard from '@/components/PortraitGameCard';
import SearchIcon from '@/components/SearchIcon';
import SpinnerIcon from '@/components/SpinnerIcon';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { ScrollText } from '@/components/scroll/ScrollText';
import { useBreakpoints } from '@/hooks/useBreakpoint';
import { useClickOutside } from '@/hooks/useClickOutside';
import { mergeCls, pascalCase } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useDeferredValue, useRef, useState } from 'react';
import { useQuery } from 'react-query';

export function MobileSearch() {
  const ref = useRef<HTMLDialogElement>(null);
  const handleClick = () => {
    window.location.hash = '#search';
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    if (!header || !nav) {
      return;
    }
    ref.current?.showModal();
    document.body.style.setProperty('overflow', 'hidden');
  };
  const handleClose = () => {
    document.body.style.setProperty('overflow', 'auto');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block bg-default p-2 sm:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="flex h-10 w-full items-center rounded bg-paper_2 px-2"
      >
        <SearchIcon />
      </button>
      <dialog
        ref={ref}
        onClose={handleClose}
        className={mergeCls(
          'inset-0 m-0 h-full max-h-[unset] w-full max-w-[unset] p-2',
          'bg-default  text-white_primary shadow-lg shadow-black',
          'animate-[300ms_scale-in-up,_200ms_fade-in] [animation-fill-mode:_forwards] [animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)]'
        )}
      >
        <SearchBar SearchResult={MobileSearchResult} />
      </dialog>
    </div>
  );
}
export function DesktopSearch() {
  return (
    <div className="relative hidden sm:block">
      <SearchBar SearchResult={DesktopSearchResult} />
    </div>
  );
}

const breakpoints = [640] as const;
type UseSearchParams = {
  keyword: string | null;
};
function useSearch(params: UseSearchParams) {
  const { keyword } = params;
  const { b640 } = useBreakpoints(breakpoints);
  const result = useQuery(
    ['search-by-keyword', keyword],
    async () => await GameActions.games.getGameList({ keyword: keyword ?? '', limit: 10, skip: 0 }),
    { enabled: Boolean(keyword) || b640 < 0 }
  );
  return result;
}
type DesktopSearchBar2Props = {
  SearchResult: typeof DesktopSearchResult | typeof MobileSearchResult;
};
export function SearchBar(props: DesktopSearchBar2Props) {
  const { SearchResult } = props;
  const ref = useRef<HTMLFormElement>(null);
  const isOutside = useClickOutside(ref);
  const [keyword, setKeyword] = useState<string | null>(null);
  const { isLoading, data } = useSearch({ keyword });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(event.target.value);
  }

  return (
    <>
      <div className="flex h-max items-center rounded bg-white/[0.15] pl-4 pr-2 transition-colors hover:bg-white/[0.25]">
        <SearchIcon />
        <form ref={ref} action={GameActions.homePage.searchByKeyword} className="w-full">
          <Input
            placeholder="Search..."
            onChange={onChange}
            autoComplete={'off'}
            className={mergeCls(
              'h-10 border-0 px-2 py-2 outline-0 outline-offset-0',
              'bg-transparent text-sm text-white',
              'w-full transition-[width] duration-300 ease-in-out sm:!w-[12ch] sm:focus:!w-[30ch]'
            )}
          />
        </form>
        <SpinnerIcon className="ml-auto" isLoading={isLoading} />
      </div>
      {data ? (
        <SearchResult data={data} keyword={keyword} isOutside={isOutside} isLoading={isLoading} />
      ) : null}
    </>
  );
}

type SearchResultProps = {
  keyword: string | null;
  isOutside: boolean;
  isLoading: boolean;
  data: Awaited<ReturnType<typeof GameActions.games.getGameList>>;
};
export function DesktopSearchResult(props: SearchResultProps) {
  const { keyword, isOutside, isLoading, data } = props;
  const { data: gameList } = data;
  const defferedData = useDeferredValue(gameList);
  const length = defferedData.slice(0, 5).length;
  const height = isOutside || !keyword ? 0 : length * 83;

  return (
    <div className="absolute mt-1 h-max min-h-max w-full overflow-hidden rounded bg-paper_2 shadow-md shadow-black/60">
      <div style={{ height: `${height}px` }} className=" transition-[height] duration-300">
        {defferedData.slice(0, 5).map((item) => (
          <Link
            href={`/${item.slug}`}
            title={item.name}
            style={{ height: `${height}px` }}
            key={item.ID}
          >
            <div
              className="flex gap-4 rounded px-2 py-2 transition-colors duration-75 hover:bg-paper hover:brightness-105"
              key={item.ID}
            >
              <Image
                src={item.images.portraits[0].url}
                width={50}
                height={70}
                alt={`portrait image of ${item.name}`}
                className="rounded bg-paper"
              />
              <div className="flex flex-col justify-between">
                <div className="overflow-hidden">
                  <GameNameScrollText>{item.name}</GameNameScrollText>
                  <p className="relative w-max rounded bg-paper px-1 text-xs text-white/60 after:absolute after:inset-0 after:rounded after:bg-white/[0.15]">
                    {pascalCase(item.type, '_')}
                  </p>
                </div>
                <p className="text-sm text-white_primary">đ{item.sale_price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {keyword && gameList.length === 0 && !isLoading ? (
        <p className="p-2 text-sm text-white/60">No game found</p>
      ) : null}
    </div>
  );
}
export function MobileSearchResult(props: SearchResultProps) {
  const { data } = props;
  const { data: gameList, total, limit, page } = data;
  const defferedData = useDeferredValue(gameList);

  return (
    <div className="mt-4 overflow-scroll">
      <div className="grid grid-cols-2 gap-4 mb-8">
        {defferedData.map((game) => {
          return <PortraitGameCard key={game.ID} game={game} />;
        })}
      </div>
      <Pagination total={total} perPage={limit} currentPage={page} className='w-max overflow-hidden' />
    </div>
  );
}

function GameNameScrollText({ children }: React.PropsWithChildren<{}>) {
  return (
    <IntersectionObserverContainer options={{ threshold: [1] }}>
      <IntersectionObserverRoot>
        <div className="flex w-[250px] gap-8">
          <ScrollText className="w-max whitespace-nowrap text-sm text-white/70">
            {children}
          </ScrollText>
        </div>
      </IntersectionObserverRoot>
    </IntersectionObserverContainer>
  );
}
