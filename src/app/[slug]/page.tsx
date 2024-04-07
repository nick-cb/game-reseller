import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import ExpandableDescription from '@/components/ExpandableDescription';
import GameItemCarousel from '@/components/game/game-item-carousel/GameItemCarousel';
import rehypeRaw from 'rehype-raw';
import {
  OmitGameId,
  countGameAddonsById,
  findGameBySlug,
  findMappingById,
} from '@/actions/game/select';
import { GameImages } from '@/database/models';
import GameCard from '@/components/game/GameCard';
import Link from 'next/link';
import { currencyFormatter, pascalCase } from '@/utils';
import { BuyNowButton } from '@/components/game/BuyNowButton';
import SystemRequirements from '@/components/game/SystemRequirements';
import { AddToCartButton } from '@/components/game/AddToCartBtn';
import { GameNav } from '@/components/game/GameNav';
import { groupImages } from '@/utils/data';
import { CriticRating } from '@/components/game/CriticRating';
import { Polls } from '@/components/game/Polls';
import { AvgRating } from '@/components/game/AvgRating';
import { DescriptionAndFeature } from '@/components/game/DescriptionAndFeature';
import { InfoLineItems } from '@/components/game/game-item-carousel/InfoLineItems';
import { FullDescription } from '@/components/game/game-item-carousel/FullDescription';

function groupLandscape(images: OmitGameId<GameImages>[]) {
  const carousel: OmitGameId<GameImages>[] = [];
  const longDescription: OmitGameId<GameImages>[][] = [];

  for (const image of images) {
    const type = image.type.toLowerCase();
    const isLandscapeLike =
      type.includes('wide') || type.includes('carousel') || type.includes('feature');
    if (isLandscapeLike && !type.includes('video') && !image.row) {
      carousel.push(image);
      continue;
    }
    if (image.row) {
      if (!longDescription[image.row]) {
        longDescription[image.row] = [];
      }
      longDescription[image.row].push(image);
    }
  }

  return { carousel, longDescription };
}

const page = async ({ params }: { params: any }) => {
  const { slug } = params;
  const { data: game } = await findGameBySlug(slug);
  if (!game) {
    return <div>Game not found</div>;
  }
  const { data: addOnCount } = await countGameAddonsById(game.ID);

  const { data: mappings } = await findMappingById(
    game.type === 'base_game' ? game.ID : game.base_game_id
  );
  const editions = mappings.filter((g) => g.type.includes('edition'));
  const dlc = mappings.filter((g) => g.type.includes('dlc'));
  const addOns = mappings.filter((g) => g.type.includes('add_on'));
  const dlcAndAddons = dlc.concat(addOns);

  const { carousel: carouselImages, longDescription: longDescriptionImages } = groupLandscape(
    game.images
  );
  const { logo, landscape } = groupImages(game.images);

  return (
    <div className="pt-6">
      <h1 className="pb-6 text-2xl text-white_primary">{game.name}</h1>
      {addOnCount || game.base_game_id ? (
        <div className="mb-6">
          <GameNav
            slug={game.base_game_slug || game.slug}
            type={game.base_game_id ? 'add-ons' : 'base'}
          />
        </div>
      ) : null}
      <div className="grid grid-cols-3 grid-rows-[min-content_auto] gap-4 md:grid-cols-5 md:gap-8 lg:gap-16 xl:grid-cols-6">
        <section className="col-span-full col-start-1 row-start-1 row-end-2 md:[grid-column:-3/1]">
          <GameItemCarousel videos={game.videos} images={carouselImages} />
        </section>
        <section
          className="col-span-3 
          row-start-3 w-full sm:row-end-4 
          md:col-start-3 md:col-end-4 md:row-start-1 md:[grid-column:-1/-3]"
        >
          <div className="top-[116px] flex flex-col gap-4 md:sticky">
            <div className="relative hidden aspect-[3/2] w-full items-center justify-center md:flex">
              <Image
                src={logo?.url || landscape.url}
                width={420}
                height={300}
                alt={`logo of ${game.name}`}
                className="rounded object-contain"
              />
            </div>
            <p className="w-max rounded bg-white_primary/[.15] px-2 py-1 text-xs text-white_primary shadow-sm shadow-black/60">
              {pascalCase(game.type, '_')}
            </p>
            <p className="text-white_primary">
              {game.sale_price > 0 ? currencyFormatter(game.sale_price) : 'Free'}
            </p>
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
            <FullDescription
              longDescription={game.long_description}
              longDescriptionImages={longDescriptionImages}
            />
          </section>
        ) : null}
        {editions.length > 0 ? (
          <>
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
          </>
        ) : null}
        {dlcAndAddons.length > 0 ? (
          <>
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
          </>
        ) : null}
        {game.avg_rating ? (
          <section className="col-span-full col-start-1 xl:[grid-column:-3/1]">
            <h2 className="pb-4 text-xl">Player Ratings</h2>
            <AvgRating avg_rating={game.avg_rating} />
          </section>
        ) : null}
        {game.polls && (
          <section className="col-span-full col-start-1 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 xl:[grid-column:-3/1]">
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
