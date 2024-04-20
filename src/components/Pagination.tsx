'use client';

import { mergeCls } from '@/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

type PaginationProps = {
  total: number;
  perPage: number;
  currentPage: number;
  className?: string;
};
const Pagination = (props: PaginationProps) => {
  const { total, perPage, currentPage, className = '' } = props;
  const searchParams = useSearchParams();
  return (
    <ul className={mergeCls(className, 'flex w-full items-center justify-center gap-2')}>
      {Array(Math.ceil(total / perPage))
        .fill(null)
        .map((_, index) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('page', (index + 1).toString());
          return (
            <li key={index}>
              <Link
                href={`/browse?${params.toString()}`}
                className={
                  'relative block overflow-hidden rounded bg-paper px-4 py-2 text-white_primary ' +
                  ' after:absolute after:inset-0 after:transition-colors after:hover:bg-white_primary/25 ' +
                  (!currentPage && index === 0 ? ' bg-white_primary/25' : '') +
                  (currentPage === index + 1 ? ' bg-white_primary/25' : '')
                }
              >
                {index + 1}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default Pagination;
