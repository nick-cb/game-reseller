'use client';

import { Tags } from '@/database/models/model';
import { useRef, useState } from 'react';
import Sheet from 'react-modal-sheet';
import { CategoryCheckbox } from '../CategoryCheckbox';
import BrowseSearch from '../BrowseSearch';
import SearchIcon from '../SearchIcon';
import { useSearchParams } from 'next/navigation';

type FilterProps = {
  tags: Tags[];
};
export default function Filter(props: FilterProps) {
  const { tags } = props;
  const searchParams = useSearchParams();
  const filters = searchParams.get('categories');
  const filterLength = filters?.split(',').length || 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex h-9 flex-grow items-center rounded bg-white/[0.15] pl-4 transition-colors hover:bg-white/25">
          <SearchIcon />
          <input
            onTouchStart={(event) => {
              event.preventDefault();
              setOpen(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 500);
            }}
            onClick={(event) => {
              event.preventDefault();
              setOpen(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 500);
            }}
            className="h-full w-full bg-transparent"
          />
        </div>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="relative"
        >
          <svg width={24} height={24} stroke="white" className="m-auto">
            <use width={24} height={24} xlinkHref="/svg/sprites/actions.svg#filter" />
          </svg>
          {filterLength ? (
            <div className="absolute -bottom-0 right-0 rounded-full bg-red-500 px-1 text-xs">
              {filterLength}
            </div>
          ) : null}
        </button>
      </div>
      <Sheet
        isOpen={open}
        snapPoints={[-50, 500, 900, 0]}
        dragVelocityThreshold={500}
        dragCloseThreshold={0.6}
        initialSnap={1}
        onClose={() => {
          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }
          setOpen(false);
        }}
        className={
          'transition-colors md:hidden ' + (open ? '!pointer-events-auto bg-default/40' : '')
        }
      >
        <Sheet.Container className="!bg-paper_2">
          <Sheet.Header className="rounded-t-lg bg-paper_2" />
          <Sheet.Content className="bg-paper_2 px-2 text-white_primary">
            <Sheet.Scroller draggableAt="both">
              <BrowseSearch className="mb-4" ref={inputRef} />
              <div className="mb-2">Category</div>
              <ul className="flex flex-col gap-1">
                {tags.map((tag) => {
                  return (
                    <li
                      key={tag.ID}
                      className="relative flex
                      rounded text-sm text-white/60"
                    >
                      <div className="absolute inset-0 bg-paper_2"></div>
                      <CategoryCheckbox
                        tag={tag}
                        id={tag.tag_key.toString()}
                        className="peer h-9 w-full"
                      />
                      <label
                        htmlFor={tag.tag_key}
                        className={
                          'absolute inset-0 h-9 rounded px-2 ' +
                          'flex cursor-pointer items-center ' +
                          'bg-paper_2 text-white/60 transition-colors hover:text-white_primary ' +
                          'peer-checked:bg-white/[.15] peer-checked:text-white_primary ' +
                          'peer-focus:text-white_primary '
                        }
                      >
                        {tag.name[0].toUpperCase() + tag.name.substring(1)}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
}
