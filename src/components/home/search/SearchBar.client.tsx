'use client';

import React, { PropsWithChildren, useCallback, useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { pascalCase } from '@/utils';
import SearchIcon from '@/components/SearchIcon';
import PortraitGameCard from '@/components/PortraitGameCard';
import { Input } from '@/components/Input';
import { SearchbarContext } from '@/components/home/search/SearchBarProvider';
import { useBreakpoints } from '@/hooks/useBreakpoint';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { ScrollText } from '@/components/scroll2/ScrollText';

export const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  function ({ onChange, onFocus, onKeyDown, ...rest }, ref) {
    const searchContext = useContext(SearchbarContext);

    const _onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        searchContext.onChange?.(e);
        onChange?.(e);
      },
      [searchContext.onChange, onChange]
    );

    const _onFocus: React.FocusEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        searchContext.onFocus?.(e);
        onFocus?.(e);
      },
      [searchContext.onFocus, onFocus]
    );

    const _onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        searchContext.onKeyDown?.(e);
        onKeyDown?.(e);
      },
      [searchContext.onKeyDown, onKeyDown]
    );

    return (
      <Input ref={ref} {...rest} onChange={_onChange} onFocus={_onFocus} onKeyDown={_onKeyDown} />
    );
  }
);

export function DesktopSearchResult({ className = '' }: { className?: string }) {
  const { data, keyword, changeHeight } = useContext(SearchbarContext);
  return (
    <div
      className={`duration-400 absolute right-0 z-20 h-0 
                    w-[325px] overflow-hidden rounded bg-paper_2 
                    shadow-md shadow-white/10 transition-[height] ease-in-out ${className}`}
      ref={changeHeight}
    >
      {(data || []).slice(0, 5).map((item) => (
        <Link href={`/${item.slug}`} title={item.name}>
          <div
            className="flex gap-4 rounded px-2 py-2 transition-colors duration-75 hover:bg-paper hover:brightness-105"
            key={item.ID}
          >
            <Image
              src={item.images.portraits[0].url}
              width={50}
              height={70}
              alt={`portrait image of ${item.name}`}
              className="rounded"
            />
            <div className="flex flex-col justify-between">
              <div className="overflow-hidden">
                {/* <Scroll */}
                {/*   containerSelector={ */}
                {/*     "#" + item.slug.replace("/", "-") + "-infinite-scroll-name" */}
                {/*   } */}
                {/*   infiniteScroll */}
                {/*   observerOptions={{ */}
                {/*     threshold: 1, */}
                {/*   }} */}
                {/* > */}
                {/*   <div */}
                {/*     id={item.slug.replace("/", "-") + "-infinite-scroll-name"} */}
                {/*     className="w-[250px] flex gap-8" */}
                {/*   > */}
                {/*     <ScrollItem */}
                {/*       as="p" */}
                {/*       className="text-sm text-white/70 whitespace-nowrap w-max" */}
                {/*     > */}
                {/*       {item.name} */}
                {/*     </ScrollItem> */}
                {/*   </div> */}
                {/* </Scroll> */}
                <IntersectionObserverContainer options={{ threshold: [1] }}>
                  <IntersectionObserverRoot>
                    <div className="flex w-[250px] gap-8">
                      <ScrollText className="w-max whitespace-nowrap text-sm text-white/70">
                        {item.name}
                      </ScrollText>
                    </div>
                  </IntersectionObserverRoot>
                </IntersectionObserverContainer>
                <p className="relative w-max rounded bg-paper px-1 text-xs text-white/60 after:absolute after:inset-0 after:rounded after:bg-white/[0.15]">
                  {pascalCase(item.type, '_')}
                </p>
              </div>
              <p className="text-sm text-white_primary">đ{item.sale_price}</p>
            </div>
          </div>
        </Link>
      ))}
      {keyword && (data || []).length === 0 && (
        <p className="p-2 text-sm text-white/60">No game found</p>
      )}
    </div>
  );
}

export function MobileSearchModal({ children }: PropsWithChildren) {
  const { b640 } = useBreakpoints([640]);
  useParams();

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // if (b640 >= 0) {
    //   ref.current?.close();
    // }
  }, [b640]);

  useEffect(() => {
    if (window.location.hash !== '#search' && ref.current?.open) {
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      if (!header || !nav) {
        return;
      }
      header.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }], {
        duration: 200,
        easing: 'ease-in-out',
      });
      nav.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }], {
        duration: 200,
        easing: 'ease-in-out',
      });
      const animation = ref.current?.animate([{ transform: 'translateY(100%)' }], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards',
      });
      const animation2 = ref.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
      });
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
          window.location.hash = '#search';
          const header = document.querySelector('header');
          const nav = document.querySelector('nav');
          if (!header || !nav) {
            return;
          }
          ref.current?.showModal();
          header.animate([{ transform: 'translateY(-100%)' }], {
            duration: 400,
            easing: 'ease-in-out',
          });
          nav.animate([{ transform: 'translateY(-100%)' }], {
            duration: 400,
            easing: 'ease-in-out',
          });
        }}
        className="flex h-10 w-full items-center rounded bg-paper_2 px-2"
      >
        <SearchIcon />
      </button>
      <dialog
        ref={ref}
        className={
          'overflow-hidden bg-default p-0 text-white_primary shadow-lg shadow-black ' +
          ' inset-0 m-0 h-full max-h-[unset] w-full max-w-[unset]  ' +
          'animate-[300ms_scale-in-up,_200ms_fade-in] [animation-fill-mode:_forwards] ' +
          'p-2 [animation-timing-function:_cubic-bezier(0.5,_-0.3,_0.1,_1.5)] '
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
      <div className="grid h-screen grid-cols-2 gap-4 overflow-scroll pb-32">
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
