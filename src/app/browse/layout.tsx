import React, { PropsWithChildren } from "react";
import { CategoryCheckbox } from "../components/CategoryCheckbox";
import { handleSubmitFilter } from "../actions";
import FilterContextProvider from "../components/FilterContext";
import BrowseSearch from "../components/BrowseSearch";

const categories = [
  { name: "action" },
  { name: "adventure" },
  { name: "indie" },
  { name: "rpg" },
  { name: "strategy" },
  { name: "open world" },
  { name: "shooter" },
  { name: "puzzle" },
  { name: "first person" },
  { name: "narration" },
  { name: "simulator" },
  { name: "casual" },
  { name: "turn-based" },
  { name: "exploration" },
  { name: "horror" },
  { name: "platformer" },
  { name: "party" },
  { name: "survival" },
  { name: "trivia" },
  { name: "city builder" },
  { name: "steath" },
  { name: "fighting" },
  { name: "comedy" },
  { name: "action-adventure" },
];

const layout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-start-1 col-end-4 text-white_primary">{children}</div>
      <form className="col-start-4 col-end-5" action={handleSubmitFilter}>
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
            {categories.map((category) => (
              <li
                key={category.name}
                className="rounded flex
                text-white/60 text-sm relative"
              >
                <div className="absolute inset-0 bg-default"></div>
                <CategoryCheckbox
                  categoryName={category.name}
                  className="w-full h-9"
                  id={category.name}
                />
                <label
                  htmlFor={category.name}
                  className="absolute inset-0 h-9 rounded px-2
                  cursor-pointer flex items-center
                  text-white/60 hover:text-white_primary bg-default transition-colors"
                >
                  {category.name[0].toUpperCase() + category.name.substring(1)}
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
