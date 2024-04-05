import { groupImages } from '@/utils/data';
import { FeatureCard } from '../HoverPlayVideo';
import { getCollectionByKey2 } from '@/actions/collections';
import { Suspense } from 'react';

export async function Feature() {
  const { data } = await getCollectionByKey2(['feature']);
  const feature = data[0];

  return (
    <section>
      <ul
        id={'feature-mobile-scroll-list'}
        className={'scrollbar-hidden flex snap-x snap-mandatory gap-8 overflow-scroll'}
      >
        {feature?.list_game.slice(0, 3).map((item) => {
          return (
            <li
              key={item.ID}
              className="group w-4/5 flex-shrink-0 cursor-pointer snap-center first-of-type:snap-start sm:w-full sm:flex-shrink"
            >
              <Suspense>
                <FeatureCard
                  key={item.ID}
                  item={{ ...item, images: groupImages(item.images) } as any}
                />
              </Suspense>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
