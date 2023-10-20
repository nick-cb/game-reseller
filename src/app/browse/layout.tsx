import React, { PropsWithChildren } from "react";
import { CategoryCheckbox } from "@/components/CategoryCheckbox";
import { handleSubmitFilter } from "../actions";
import FilterContextProvider from "@/components/FilterContext";
import BrowseSearch from "@/components/BrowseSearch";
import Filter from "@/components/browse/Filter";
import { connectDB } from "@/database";
import {
  Accordion,
  AccordionBody,
  AccordionGroup,
  AccordionHeader,
} from "@/components/Accordion";
import { CollectionRadio, RadioGroup } from "@/components/CollectionRadio";
import { getAllCollections } from "@/actions/collections";
import findTagByGroupName from "@/actions/tags";

const layout = async ({ children }: PropsWithChildren) => {
  const db = await connectDB();
  const [tags, { data: collections = [] }] = await Promise.all([
    findTagByGroupName("genre", db),
    getAllCollections({ db }),
  ]);
  db.destroy();

  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-start-1 col-end-5 md:col-end-4 text-white_primary">
        {children}
      </div>
      <FilterContextProvider>
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-default block md:hidden z-50">
          <Filter tags={tags[0]} />
        </div>
        <form
          className="col-start-4 col-end-5 hidden md:block"
          action={handleSubmitFilter}
        >
          <noscript>
            <button
              className="w-full py-2 rounded mb-4
            bg-primary text-white shadow-white/10 shadow-md hover:brightness-105 transition-[filter]"
            >
              Submit filter
            </button>
          </noscript>
          <BrowseSearch />
          <hr className="border-white/20 my-4" />
          <AccordionGroup>
            <Accordion index={0}>
              <AccordionHeader className="flex items-center justify-between w-[calc(100%+16px)] -translate-x-2 px-2 py-4 rounded outline-white outline outline-0 focus:outline-1">
                <div>Collections</div>
                <div>
                  <svg width={24} height={24} fill="white">
                    <use
                      width={24}
                      height={24}
                      xlinkHref="/svg/sprites/actions.svg#chevron-thin-down"
                    />
                  </svg>
                </div>
              </AccordionHeader>
              <AccordionBody className="mt-1">
                <RadioGroup toggleAble>
                  <ul className="flex flex-col gap-1">
                    {collections.map((collection) => {
                      return (
                        <li
                          key={collection.ID}
                          className="rounded flex
                text-white/60 text-sm relative"
                        >
                          <div className="absolute inset-0 bg-default"></div>
                          <CollectionRadio
                            tabIndex={0}
                            collection={collection}
                            className="h-9 w-full peer"
                          />
                          <label
                            htmlFor={collection.collection_key}
                            className="absolute inset-0 h-9 rounded px-2
                  cursor-pointer flex items-center
                  text-white/60 hover:text-white_primary bg-default transition-colors peer-checked:bg-white/[.15]"
                          >
                            {collection.name[0].toUpperCase() +
                              collection.name.substring(1)}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </RadioGroup>
              </AccordionBody>
            </Accordion>
            <hr className="border-white_primary/20 my-4" />
            <Accordion index={1}>
              <AccordionHeader className="flex items-center justify-between w-[calc(100%+16px)] -translate-x-2 px-2 py-4 rounded outline-white outline outline-0 focus:outline-1">
                <span>Categories</span>
                <div>
                  <svg width={24} height={24} fill="white">
                    <use
                      width={24}
                      height={24}
                      xlinkHref="/svg/sprites/actions.svg#chevron-thin-down"
                    />
                  </svg>
                </div>
              </AccordionHeader>
              <AccordionBody className="mt-1">
                <ul className="flex flex-col gap-1">
                  {tags[0].map((tag) => (
                    <li
                      key={tag.ID}
                      className="rounded flex
                text-white/60 text-sm relative"
                    >
                      <div className="absolute inset-0 bg-default"></div>
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
                          "text-white/60 hover:text-white_primary bg-default transition-colors " +
                          " peer-checked:bg-white/[.15] peer-checked:text-white_primary " +
                          " peer-focus:text-white_primary "
                        }
                      >
                        {tag.name[0].toUpperCase() + tag.name.substring(1)}
                      </label>
                    </li>
                  ))}
                </ul>
              </AccordionBody>
            </Accordion>
          </AccordionGroup>
        </form>
      </FilterContextProvider>
    </div>
  );
};

export default layout;
