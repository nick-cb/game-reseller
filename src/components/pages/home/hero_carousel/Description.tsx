import { Game, GameImageGroup } from '@/database/models/model';
import React from 'react';

export type HeroCarouselGame = Pick<
  Game,
  'ID' | 'name' | 'slug' | 'description' | 'avg_rating' | 'developer'
> & {
  images: GameImageGroup;
};
export const Description = ({ game }: { game: HeroCarouselGame }) => {
  return (
    <div className="flex max-w-sm flex-grow flex-col justify-evenly">
      <div
        className="logo relative aspect-video w-36 lg:w-80"
        style={{
          backgroundImage: game.images.logos[0]?.url
            ? `url(${decodeURIComponent(game.images.logos[0].url)})`
            : '',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
        }}
      >
        {/* <Image src={} alt="" fill className="object-contain" /> */}
      </div>
      <p className="hidden text-white_primary sm:block lg:text-lg">
        {game.description?.split('.')[0]}
      </p>
    </div>
  );
};
