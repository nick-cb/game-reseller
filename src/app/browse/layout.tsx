import React, { PropsWithChildren } from 'react';
import { CategoryCheckbox } from '@/components/CategoryCheckbox';
import { handleSubmitFilter } from '../actions';
import FilterContextProvider from '@/components/FilterContext';
import BrowseSearch from '@/components/BrowseSearch';
import Filter from '@/components/browse/Filter';
import { Accordion, AccordionBody, AccordionGroup, AccordionHeader } from '@/components/Accordion';
import { CollectionRadio, RadioGroup } from '@/components/CollectionRadio';
import ShareActions from '@/actions2/share';

const layout = async ({ children }: PropsWithChildren) => {
  const [{ data: tags }, { data: collections }] = await Promise.all([
    ShareActions.tags.getTagListByGroupName({ groupName: 'genre' }),
    ShareActions.collections.getAllCollections(),
  ]);

  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-start-1 col-end-5 text-white_primary md:col-end-4">{children}</div>
      <FilterContextProvider>
        <div className="fixed bottom-0 left-0 right-0 z-50 block bg-default p-2 md:hidden">
          <Filter tags={tags || []} />
        </div>
        <form className="col-start-4 col-end-5 hidden md:block" action={handleSubmitFilter}>
          <noscript>
            <button
              className="mb-4 w-full rounded bg-primary
            py-2 text-white shadow-md shadow-white/10 transition-[filter] hover:brightness-105"
            >
              Submit filter
            </button>
          </noscript>
          <BrowseSearch />
          <hr className="my-4 border-white/20" />
          <AccordionGroup>
            <Accordion index={0}>
              <AccordionHeader className="flex w-[calc(100%+16px)] -translate-x-2 items-center justify-between rounded px-2 py-4 outline outline-0 outline-white focus:outline-1">
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
                      if (!collection) {
                        return null;
                      }
                      return (
                        <li
                          key={collection.ID}
                          className="relative flex
                rounded text-sm text-white/60"
                        >
                          <div className="absolute inset-0 bg-default"></div>
                          <CollectionRadio
                            tabIndex={0}
                            collection={collection}
                            className="peer h-9 w-full"
                          />
                          <label
                            htmlFor={collection.collection_key}
                            className="absolute inset-0 flex h-9 cursor-pointer
                  items-center rounded bg-default
                  px-2 text-white/60 transition-colors hover:text-white_primary peer-checked:bg-white/[.15]"
                          >
                            {collection.name[0].toUpperCase() + collection.name.substring(1)}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </RadioGroup>
              </AccordionBody>
            </Accordion>
            <hr className="my-4 border-white_primary/20" />
            <Accordion index={1}>
              <AccordionHeader className="flex w-[calc(100%+16px)] -translate-x-2 items-center justify-between rounded px-2 py-4 outline outline-0 outline-white focus:outline-1">
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
                  {tags.map((tag) => (
                    <li
                      key={tag.ID}
                      className="relative flex
                rounded text-sm text-white/60"
                    >
                      <div className="absolute inset-0 bg-default"></div>
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
                          'bg-default text-white/60 transition-colors hover:text-white_primary ' +
                          ' peer-checked:bg-white/[.15] peer-checked:text-white_primary ' +
                          ' peer-focus:text-white_primary '
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
