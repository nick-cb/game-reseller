import GameActions from '@/+actions/games-actions';
import React from 'react';
import GameCard from './GameCard';
import Link from 'next/link';
import { Text } from '@/components/Typography';

type RelatedGamesProps = {
  game: { ID: number; slug: string };
};
export async function RelatedGames(props: RelatedGamesProps) {
  const { game } = props;
  const { data, error } = await GameActions.gameDetailPage.findMappingGroupByID(game.ID);
  if (error) {
    return null;
  }

  const { editions, dlcs, addons } = data;
  const dlcAndAddons = dlcs.concat(addons);

  return (
    <>
      {editions.length ? (
        <section className="col-span-full col-start-1 xl:[grid-column:-3/1]">
          <Text as="h2" className="pb-4 text-xl">
            Editions
          </Text>
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
          <Text as="h2" className="pb-4 text-xl">
            Add-ons
          </Text>
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
              href={`${game.slug}/add-ons`}
              className="block w-full rounded border border-white_primary/60 py-4 text-center text-sm transition-colors hover:bg-paper"
            >
              See more
            </Link>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
