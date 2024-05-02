import {
  MobileSearchModal,
  MobileSearchResult,
  SearchInput,
  DesktopSearchResult,
} from './SearchBar.client';
import React from 'react';
import SearchbarProvider from '@/components/pages/home/search/SearchBarProvider';

export async function MobileSearch() {
  return (
    <MobileSearchModal>
      <SearchbarProvider
        SearchResultSlot={<MobileSearchResult />}
        className="flex h-[unset] flex-col gap-4"
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
          ' border-0 px-2 py-2 outline-0 outline-offset-0 ' +
          ' bg-transparent text-sm text-white ' +
          ' ${className} !w-[12ch] transition-[width] duration-300 ease-in-out focus:!w-[30ch] '
        }
        placeholder="Search..."
      />
    </SearchbarProvider>
  );
}
