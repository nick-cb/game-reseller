import React, { PropsWithChildren } from "react";
import { CategoryCheckbox } from "@/components/CategoryCheckbox";
import { handleSubmitFilter } from "../actions";
import FilterContextProvider from "@/components/FilterContext";
import BrowseSearch from "@/components/BrowseSearch";
import "./browse.css";
import findTagByGroupName from "@/database/repository/tags/select";
import Filter from "@/components/browse/Filter";

const layout = async ({ children }: PropsWithChildren) => {
  const tags = await findTagByGroupName("genre");

  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-start-1 col-end-5 md:col-end-4 text-white_primary">
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-default block sm:hidden z-50">
          <Filter tags={tags[0]} />
        </div>
        {children}
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
        <FilterContextProvider>
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
                  className="w-full h-9"
                />
                <label
                  htmlFor={tag.tag_key}
                  className="absolute inset-0 h-9 rounded px-2
                  cursor-pointer flex items-center
                  text-white/60 hover:text-white_primary bg-default transition-colors"
                >
                  {tag.name[0].toUpperCase() + tag.name.substring(1)}
                </label>
              </li>
            ))}
          </ul>
        </FilterContextProvider>
      </form>
    </div>
  );
};

export default layout;
