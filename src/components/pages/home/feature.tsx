import { currencyFormatter, mergeCls } from '@/utils';
import CollectionActions from '@/+actions/collections-actions';
import Link from 'next/link';
import { Text } from '@/components/Typography';
import { MoneyFormatter } from '@/components/MoneyFormatter';

export async function Feature() {
  const { data: feature, error } = await CollectionActions.homepage.getFeatureRow();
  if (error) {
    throw error;
  }

  return (
    <section>
      <ul
        className={mergeCls(
          'scrollbar-hidden grid snap-x snap-mandatory grid-cols-3 overflow-scroll',
          '[--tw-cols-min:300px]',
          'gap-[14px] 3/4sm:gap-[18px] lg:gap-6'
        )}
      >
        {feature.game_list.slice(0, 3).map((item) => {
          return (
            <li
              key={item.ID}
              className={mergeCls(
                'group flex-shrink-0 cursor-pointer snap-center first-of-type:snap-start sm:w-full sm:flex-shrink',
                'row-span-4 grid grid-rows-subgrid gap-y-4'
              )}
            >
              <Link href={'/' + item.slug} className="contents">
                <div
                  className={mergeCls(
                    'relative overflow-hidden rounded after:pointer-events-none',
                    'after:absolute after:inset-0 after:h-full after:w-full after:rounded',
                    'after:bg-white after:opacity-0 after:transition-opacity'
                  )}
                >
                  <img src={item.images.landscapes[0]?.url + '?h=480&w=854&resize=1'} />
                </div>
                <Text as="h3" size="base">
                  {item.name}
                </Text>
                <Text className="line-clamp-4 md:line-clamp-5" dim>
                  {item.description}
                </Text>
                <Text>
                  <MoneyFormatter amount={item.sale_price} />
                </Text>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
