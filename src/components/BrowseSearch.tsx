'use client';

import React, { forwardRef } from 'react';
import SearchIcon from './SearchIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import { mergeCls } from '@/utils';

const BrowseSearch = forwardRef<HTMLInputElement, { className?: string }>(
  ({ className = '' }, ref) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    return (
      <div
        className={mergeCls(
          className,
          'flex items-center rounded bg-white/[0.15] px-4 transition-colors hover:bg-white/25'
        )}
      >
        <SearchIcon />
        <input
          ref={ref}
          type="search"
          name="keyword"
          className="relative w-full rounded bg-transparent py-2 pl-2 text-sm text-white_primary outline-none"
          placeholder="Search..."
          defaultValue={searchParams.get('keyword') || ''}
          onChange={(e) => {
            const keyword = e.target.value;
            if (!keyword) {
              return router.push(`/browse`);
            }
            const params = new URLSearchParams(searchParams.toString());
            params.set('keyword', keyword);
            params.delete('page');
            router.push(`/browse?${params.toString()}`);
          }}
        />
      </div>
    );
  }
);

export default BrowseSearch;
