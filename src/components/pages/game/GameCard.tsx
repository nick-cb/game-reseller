import { currencyFormatter, mergeCls } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AddToCartButton } from './AddToCartBtn';
import { Button } from '@/components/Buttons';

type GameCardProps = {
  game: Pick<Game, 'ID' | 'name' | 'slug' | 'description' | 'sale_price'> & {
    images: GameImageGroup;
  };
  type: 'base' | 'edition' | 'add-on';
};
const GameCard = (props: GameCardProps) => {
  const { game, type } = props;
  const { images } = game;

  return (
    <div className="game-card grid grid-cols-5 overflow-hidden rounded bg-paper_2">
      <Link href={`/${game.slug}`} className="contents">
        <div className="relative col-start-1 col-end-6 aspect-video h-full w-full sm:col-end-3">
          <Image src={images.landscapes[0]?.url} alt={`landscape of ${type} ${game.name}`} fill />
        </div>
        <div
          className={mergeCls(
            'col-start-1 col-end-6 row-start-2 flex flex-col',
            'gap-2 px-4 py-4 text-white_primary sm:col-start-3',
            'sm:row-start-1',
            'sm:px-2 md:px-4 lg:px-8'
          )}
        >
          <div className="flex items-center gap-2">
            <p className="w-max self-start whitespace-nowrap rounded bg-paper px-2 py-1 text-xs text-white_primary">
              {type.toUpperCase()}
            </p>
            <p className="text-sm">{game.name}</p>
          </div>
          <summary className="line-clamp-2 list-none text-xs text-white/60 md:line-clamp-3 lg:line-clamp-4 lg:text-sm">
            {game.description}
          </summary>
        </div>
      </Link>
      <div
        className={mergeCls(
          'col-end-1 row-start-3 border-t border-white/20 px-4 py-4 [grid-column:_1_/_-1]',
          'flex sm:items-center justify-end gap-4 flex-col sm:flex-row'
        )}
      >
        <p className="text-white_primary">
          {parseInt(game.sale_price.toString()) ? currencyFormatter(game.sale_price) : 'Free'}
        </p>
        <div className='flex gap-4 w-full sm:w-auto'>
          <Button size="sm" className="w-full sm:min-w-32">
            Buy Now
          </Button>
          <AddToCartButton game={game} size="sm" className="w-full sm:min-w-32">
            Add To Cart
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
