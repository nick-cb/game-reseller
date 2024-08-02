import Link from 'next/link';
import React from 'react';

type ButtonGroupProps = {
  game: Pick<Game, 'ID' | 'slug'>;
};
export const ButtonGroup = (props: ButtonGroupProps) => {
  const { game } = props;
  return (
    <div className="flex gap-4">
      <Link
        href={`${game.slug}/order`}
        className="w-36 rounded bg-white py-3 text-center text-sm text-default lg:w-40 lg:py-4"
      >
        BUY NOW
      </Link>
      <a
        href="#"
        className="relative z-10 w-36 overflow-hidden rounded py-3 text-center text-sm text-white transition-colors duration-200 hover:bg-white/[0.16] lg:w-40 lg:py-4"
      >
        ADD TO WISHLIST
      </a>
    </div>
  );
};
