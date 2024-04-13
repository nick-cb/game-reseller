import { OmitGameId } from "@/actions/game/select";
import { query, sql } from "@/database";
import { Game, GameImages } from "@/database/models/model";
import {
  MobileSearchModal,
  MobileSearchResult,
  SearchInput,
  DesktopSearchResult,
} from "./SearchBar.client";
import { groupImages } from "@/utils/data";
import React from "react";
import SearchbarProvider from "@/components/home/search/SearchBarProvider";

export async function MobileSearch() {
  const { data } = await query<
    (Game & {
      images: OmitGameId<GameImages>[];
    })[]
  >(sql`
      select *
      from games
               join (select game_id,
                            json_arrayagg(json_object('ID', ID, 'type', type, 'url', url, 'pos_row', pos_row, 'alt',
                                                      alt)) as images
                     from game_images
                     group by game_id) gi on games.ID = gi.game_id
      limit 25;
  `);

  return (
    <MobileSearchModal>
      <SearchbarProvider
        defaultData={data.map((game) => {
          return { ...game, images: groupImages(game.images) };
        })}
        SearchResultSlot={<MobileSearchResult />}
        className="flex flex-col gap-4 h-[unset]"
      >
        <SearchInput />
      </SearchbarProvider>
    </MobileSearchModal>
  );
}

export function DesktopSearchBar() {
  return (
    <SearchbarProvider SearchResultSlot={<DesktopSearchResult />}>
      <SearchInput
        className={
          " px-2 py-2 border-0 outline-offset-0 outline-0 " +
          " bg-transparent text-sm text-white " +
          " !w-[12ch] focus:!w-[30ch] transition-[width] ease-in-out duration-300 ${className} "
        }
        placeholder="Search..."
      />
    </SearchbarProvider>
  );
}
