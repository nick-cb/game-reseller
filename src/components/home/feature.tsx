import { groupImages } from '@/utils/data';
import { FeatureCard } from '../HoverPlayVideo';
import { Suspense } from 'react';
import HomeActions from '@/actions2/home-actions';

export async function Feature() {
  const { data: feature } = await HomeActions.category.getFeatureRow();

  return (
    <ul className={'scrollbar-hidden flex snap-x snap-mandatory gap-8 overflow-scroll'}>
      {feature.game_list.slice(0, 3).map((item) => {
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
  );
}