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
      <section className="relative pb-8">
        <CategoryRow name={'top_sale'} />
      </section>
      <hr className="my-4 border-default" />
      <section>
        <Feature />
      </section>
      <hr className="my-6 border-default" />
      <section className="w-[calc(100%_+_8px)] -translate-x-2 gap-8 md:flex">
        <Suspense>
          <PillarGroup names={['new_release', 'most_played', 'top_player_rated']} />
        </Suspense>
      </section>
      {/* <section */}
      {/*   className={ */}
      {/*     'relative flex flex-col gap-8 overflow-hidden rounded-lg p-4 ' + */}
      {/*     'after:absolute after:inset-0 after:rounded-lg after:bg-white/20 after:backdrop-blur-md' */}
      {/*   } */}
      {/* > */}
      {/* {data.splice(0, 1).map((category: any, index) => ( */}
      {/*   <div className={'flex gap-8 z-[1] explore-carousel-row-go-left '}> */}
      {/*     {[...category.list_game.slice(0, 10), ...category.list_game.slice(0, 10)].map( */}
      {/*       (game: any) => ( */}
      {/*         <div */}
      {/*           className={ */}
      {/*             'relative flex-shrink-0 ' + */}
      {/*             (index !== 0 ? '-translate-x-12 ' : '') + */}
      {/*             (index === 2 ? '-translate-x-24 ' : '') */}
      {/*             // " after:absolute after:inset-0 after:rounded-lg after:bg-white/20 after:backdrop-blur-md " */}
      {/*           } */}
      {/*         > */}
      {/*           <Image */}
      {/*             src={game.images.find((img: any) => img.type === 'landscape')?.url} */}
      {/*             width={80} */}
      {/*             height={80} */}
      {/*             alt={''} */}
      {/*             className={'rounded-lg object-cover aspect-square'} */}
      {/*           /> */}
      {/*         </div> */}
      {/*       ) */}
      {/*     )} */}
      {/*   </div> */}
      {/* ))} */}
      {/* <Link */}
      {/*   href={'/browse'} */}
      {/*   className={'z-[1] mx-auto w-40 rounded bg-white py-2 text-center text-primary'} */}
      {/* > */}
      {/*   Explore more */}
      {/* </Link> */}
      {/* </section> */}
    </>
  );
}
