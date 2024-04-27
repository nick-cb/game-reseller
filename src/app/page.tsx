import CategoryRow from '@/components/discover/Carousel';
import HeroCarousel from '@/components/home/hero_carousel/HeroCarousel';
import React, { Suspense } from 'react';
import { Feature } from '@/components/home/feature';
import { PillarGroup } from '@/components/home/pillar';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <hr className="my-4 border-default" />
      <CategoryRow name={'top_sale'} />
      <hr className="my-4 border-default" />
      <Feature />
      <hr className="my-6 border-default" />
      <Suspense>
        <PillarGroup names={['new_release', 'most_played', 'top_player_rated']} />
      </Suspense>
    </>
  );
}
