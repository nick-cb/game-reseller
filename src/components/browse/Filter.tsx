"use client";

import { Tags } from "@/database/models/model";
import { useRef, useState } from "react";
import Sheet from "react-modal-sheet";
import { CategoryCheckbox } from "../CategoryCheckbox";
import BrowseSearch from "../BrowseSearch";
import SearchIcon from "../SearchIcon";
import { useSearchParams } from "next/navigation";

export default function Filter({ tags }: { tags: Tags[] }) {
  const searchParams = useSearchParams();
  const filters = searchParams.get("categories");
  const filterLength = filters?.split(",").length || 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-between items-center gap-4">
        <div className="bg-white/[0.15] hover:bg-white/25 transition-colors rounded flex items-center pl-4 flex-grow h-9">
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
            className="bg-transparent w-full h-full"
          />
        </div>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="relative"
        >
          <svg width={24} height={24} stroke="white" className="m-auto">
            <use
              width={24}
              height={24}
              xlinkHref="/svg/sprites/actions.svg#filter"
            />
          </svg>
          {filterLength ? (
            <div className="rounded-full px-1 text-xs bg-red-500 absolute -bottom-0 right-0">
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
          "transition-colors md:hidden " +
          (open ? "bg-default/40 !pointer-events-auto" : "")
        }
      >
        <Sheet.Container className="!bg-paper_2">
          <Sheet.Header className="bg-paper_2 rounded-t-lg" />
          <Sheet.Content className="bg-paper_2 text-white_primary px-2">
            <Sheet.Scroller draggableAt="both">
              <BrowseSearch className="mb-4" ref={inputRef} />
              <div className="mb-2">Category</div>
              <ul className="flex flex-col gap-1">
                {tags.map((tag) => {
                  return (
                    <li
                      key={tag.ID}
                      className="rounded flex
                      text-white/60 text-sm relative"
                    >
                      <div className="absolute inset-0 bg-paper_2"></div>
                      <CategoryCheckbox
                        tag={tag}
                        id={tag.tag_key.toString()}
                        className="w-full h-9 peer"
                      />
                      <label
                        htmlFor={tag.tag_key}
                        className={
                          "absolute inset-0 h-9 rounded px-2 " +
                          "cursor-pointer flex items-center " +
                          "text-white/60 hover:text-white_primary bg-paper_2 transition-colors " +
                          "peer-checked:bg-white/[.15] peer-checked:text-white_primary " +
                          "peer-focus:text-white_primary "
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
