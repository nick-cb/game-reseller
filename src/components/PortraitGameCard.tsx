import Link from 'next/link';
import React from 'react';
import { currencyFormatter, mergeCls } from '@/utils';

type PortraitGameCardProps = {
  game: any;
  className?: string;
};
const PortraitGameCard = (props: PortraitGameCardProps) => {
  const { game, className = '' } = props;
  return (
    <Link
      href={`/${game.slug}`}
      key={game.slug}
      className={className + ' group flex h-full cursor-pointer flex-col justify-between'}
    >
      <div
        className={mergeCls(
          'relative overflow-hidden xs-right-pad:aspect-[3/4]',
          'after:absolute after:inset-0 after:h-full after:w-full after:rounded',
          'after:bg-white after:opacity-0 after:transition-opacity',
          'rounded bg-white/25 group-hover:after:opacity-[0.1]',
          'h-28 xs-right-pad:h-auto'
        )}
      >
        <img
          src={game.images.portraits[0]?.url + '?h=480&w=360&resize=1'}
          alt={`portrait of ${game.name}`}
          className={
            'rounded transition-transform duration-300 group-focus:scale-110' +
            'h-full w-full object-cover '
          }
          width={360}
          height={480}
        />
      </div>
      <p className="text-sm text-white_primary">{game.name}</p>
      <p className="text-xs text-white/60">{game.developer}</p>
      <p className="text-sm text-white_primary">
        {parseInt(game.sale_price) === 0 ? 'Free' : currencyFormatter(game.sale_price)}
      </p>
    </Link>
  );
};

export default PortraitGameCard;
