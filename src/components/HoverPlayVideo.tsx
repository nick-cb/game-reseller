import { GameItem } from '@/actions/collections-actions';
import { Game, GameImageGroup } from '@/database/models/model';
import { FVideoFullInfo } from '@/type';
import { currencyFormatter, mergeCls } from '@/utils';
import Link from 'next/link';

export type FeatureCardItem = Pick<Game, 'ID' | 'name' | 'slug' | 'description' | 'sale_price'> & {
  videos: FVideoFullInfo[];
  images: GameImageGroup;
};
type FeatureCardProps = {
  item: GameItem;
};
export async function FeatureCard(props: FeatureCardProps) {
  const { item } = props;
  const hasVideos = item.videos;

  return (
    <Link href={'/' + item.slug} className="relative">
      <div
        className={mergeCls(
          'aspect-media cols-min-1 relative overflow-hidden after:pointer-events-none',
          'after:absolute after:inset-0 after:h-full after:w-full after:rounded',
          'after:bg-white after:opacity-0 after:transition-opacity',
          hasVideos && 'group rounded bg-white/25 hover:after:opacity-[0.1]'
        )}
      >
        <img
          className={mergeCls(
            'h-full w-full rounded object-cover transition-opacity duration-300',
            hasVideos && ' hover:pointer-events-none hover:opacity-0'
          )}
          src={item.images.landscapes[0]?.url + '?h=480&w=854&resize=1'}
          alt={''}
          width={854}
          height={480}
        />
      </div>
      <h2 className="py-4 text-white_primary">{item.name}</h2>
      <p className="mb-2 text-sm text-white/60">{item.description}</p>
      <p>{item.sale_price === 0 ? 'Free' : currencyFormatter(item.sale_price)}</p>
    </Link>
  );
}
