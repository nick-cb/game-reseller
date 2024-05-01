import GameDetailActions from '@/actions/game-detail-actions';
import React from 'react';
import GameCard from './GameCard';
import Link from 'next/link';

type RelatedGamesProps = {
  game: { ID: number };
};
export async function RelatedGames(props: RelatedGamesProps) {
  const { game } = props;
  const { data, error } = await GameDetailActions.games.findMappingGroupByID(game.ID);
  if (error) {
    return null;
  }

  const { editions, dlcs, addons } = data;
  const dlcAndAddons = dlcs.concat(addons);

  return (
    <>
      {editions.length ? (
        <section className="col-span-full col-start-1 xl:[grid-column:-3/1]">
          <h2 className="pb-4 text-xl text-white_primary">Editions</h2>
          {editions.map((edition) => (
            <React.Fragment key={edition.ID}>
              <div className="flex flex-col gap-4">
                <GameCard game={edition} type="edition" />
              </div>
              <br className="last:hidden" />
            </React.Fragment>
          ))}
        </section>
      ) : null}
      {dlcAndAddons.length > 0 ? (
        <section className="col-span-full col-start-1 xl:[grid-column:-3/1]">
          <h2 className="pb-4 text-xl text-white_primary">Add-ons</h2>
          {dlcAndAddons.slice(0, 3).map((edition) => (
            <React.Fragment key={edition.ID}>
              <div className="flex flex-col gap-4">
                <GameCard game={edition} type="add-on" />
              </div>
              <br className="last:hidden" />
            </React.Fragment>
          ))}
          {dlcAndAddons.length > 3 ? (
            <Link
              href={'#'}
              className="block w-full rounded border border-white_primary/60 py-4
                  text-center text-sm 
                  transition-colors hover:bg-paper"
            >
              See more
            </Link>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
