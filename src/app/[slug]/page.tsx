import GameActions from '@/+actions/games-actions';
import { MoneyFormatter } from '@/components/MoneyFormatter';
import { Text } from '@/components/Typography';
import { AddToCartButton } from '@/components/pages/game/AddToCartBtn';
import { AvgRating } from '@/components/pages/game/AvgRating';
import { BuyNowButton } from '@/components/pages/game/BuyNowButton';
import { CriticRating } from '@/components/pages/game/CriticRating';
import { DescriptionAndFeature } from '@/components/pages/game/DescriptionAndFeature';
import { GameNav } from '@/components/pages/game/GameNav';
import { Polls } from '@/components/pages/game/Polls';
import { RelatedGames } from '@/components/pages/game/RelateGames';
import SystemRequirements from '@/components/pages/game/SystemRequirements';
import { FullDescription } from '@/components/pages/game/game-item-carousel/FullDescription';
import GameItemCarousel from '@/components/pages/game/game-item-carousel/GameItemCarousel';
import { InfoLineItems } from '@/components/pages/game/game-item-carousel/InfoLineItems';
import { pascalCase } from '@/utils';
import React, { Suspense } from 'react';
import Image from 'next/image';

const page = async ({ params }: { params: any }) => {
  const { slug } = params;
  const [gameDetailRes, mappingCheckRes] = await Promise.allSettled([
    GameActions.gameDetailPage.findBySlug({ slug }),
    GameActions.gameDetailPage.hasMapping(slug),
  ]);
  const game = gameDetailRes.status === 'fulfilled' ? gameDetailRes.value.data : null;
  const hasMapping = mappingCheckRes.status === 'fulfilled' ? mappingCheckRes.value : false;
  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className="pt-6">
      <h1 className="pb-6 text-2xl text-white_primary">{game.name}</h1>
      {hasMapping || game.base_game_id ? (
        <div className="mb-6">
          <GameNav
            slug={game.base_game_slug || game.slug}
            type={game.base_game_id ? 'add-ons' : 'base'}
          />
        </div>
      ) : null}
      <div className="grid grid-cols-3 grid-rows-[min-content_auto] gap-8 md:grid-cols-5 md:gap-12 lg:gap-16 xl:grid-cols-6">
        <section className="col-span-full col-start-1 row-start-1 row-end-2 md:[grid-column:-3/1]">
          <GameItemCarousel videos={game.videos} images={game.images} />
        </section>
        <section className="col-span-3 row-start-3 w-full sm:row-end-4 md:col-start-3 md:col-end-4 md:row-start-1 md:[grid-column:-1/-3]">
          <div className="top-[116px] flex flex-col gap-4 md:sticky">
            <div className="relative hidden aspect-[3/2] w-full items-center justify-center md:flex">
              <Image
                src={game.images.logos?.[0]?.url}
                width={420}
                height={300}
                alt={`logo of ${game.name}`}
                className="rounded object-contain"
              />
            </div>
            <Text
              size="xs"
              className="w-max rounded bg-white_primary/[.15] px-2 py-1 text-white_primary shadow-sm shadow-black/25"
            >
              {pascalCase(game.type, '_')}
            </Text>
            <MoneyFormatter amount={game.sale_price} />
            <div className="flex flex-col gap-2">
              <BuyNowButton game={game} />
              <AddToCartButton game={game} />
            </div>
            <InfoLineItems game={game} />
          </div>
        </section>
        <section className="col-span-full md:[grid-column:-3/1]">
          <DescriptionAndFeature description={game.description ?? ''} tags={game.tags} />
        </section>
        {game.long_description ? (
          <section className="col-span-full md:[grid-column:-3/1]">
            <FullDescription longDescription={game.long_description} longDescriptionImages={[]} />
          </section>
        ) : null}
        <Suspense>
          <RelatedGames game={game} />
        </Suspense>
        {game.avg_rating ? (
          <section className="col-span-full col-start-1 xl:[grid-column:-3/1]">
            <Text as="h2" className="pb-4 text-xl">
              Player Ratings
            </Text>
            <AvgRating avg_rating={game.avg_rating} />
          </section>
        ) : null}
        {game.polls && (
          <section className="col-span-full col-start-1 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-8 xl:[grid-column:-3/1]">
            <Polls polls={game.polls} />
          </section>
        )}
        {game.reviews?.length > 0 && (
          <section className="col-span-full col-start-1 xl:[grid-column:-3/1]">
            <CriticRating game={game} />
          </section>
        )}
        {game.systems.length > 0 && (
          <section className="col-span-full col-start-1 rounded-md bg-paper px-8 py-2 pb-8 xl:[grid-column:-3/1]">
            <SystemRequirements systems={game.systems} />
          </section>
        )}
      </div>
    </div>
  );
};

export default page;
