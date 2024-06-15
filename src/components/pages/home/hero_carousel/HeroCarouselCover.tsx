import { ButtonGroup } from './ButtonGroup';
import { Description } from './Description';
import Image from 'next/image';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { ScrollText } from '@/components/scroll/ScrollText';
import { mergeCls } from '@/utils';

type RequiredGameAttributes =
  | 'ID'
  | 'name'
  | 'slug'
  | 'description'
  | 'avg_rating'
  | 'developer'
  | 'images';
export type HeroCarouselGame = Pick<GameWithImages, RequiredGameAttributes>;
type HeroCarouselDesktopCoverProps = {
  game: HeroCarouselGame;
};
export function HeroCarouselDesktopCover(props: HeroCarouselDesktopCoverProps) {
  const { game } = props;
  return (
    <div
      className={mergeCls(
        'main-item-cover absolute inset-0 flex flex-col-reverse justify-between gap-4 p-8 lg:gap-8',
        'hidden sm:flex'
      )}
    >
      <ButtonGroup game={game} />
      <Description game={game} />
    </div>
  );
}

export function HeroCarouselMobileCover(props: HeroCarouselDesktopCoverProps) {
  const { game } = props;
  return (
    <div className="absolute bottom-0 mt-auto grid h-max w-full gap-x-4 p-4 [grid-template-columns:max-content_auto] sm:hidden">
      <div
        className={mergeCls(
          'relative flex w-16 items-center',
          'p-1 before:absolute before:inset-0 before:rounded-lg before:bg-white/20 before:backdrop-blur-md',
          'row-span-2 min-w-0'
        )}
      >
        <Image
          src={game.images.logos[0]?.url || ''}
          alt=""
          width={56}
          height={56}
          className="relative block h-14 w-14 rounded object-contain"
          priority
        />
      </div>
      <MobileCoverTitle game={game} />
      <MobileCoverBrief game={game} />
    </div>
  );
}
type MobileCoverTitleProps = {
  game: HeroCarouselGame;
};
function MobileCoverTitle(props: MobileCoverTitleProps) {
  const { game } = props;
  return (
    <div
      className={mergeCls(
        'relative col-start-2 col-end-3',
        'w-[calc(100%+16px)] min-w-0 overflow-hidden'
      )}
    >
      <IntersectionObserverContainer options={{ threshold: [1] }}>
        <IntersectionObserverRoot>
          <div className="flex gap-10">
            <ScrollText className="w-max whitespace-nowrap text-sm text-white_primary">
              {game.name}
            </ScrollText>
          </div>
        </IntersectionObserverRoot>
      </IntersectionObserverContainer>
    </div>
  );
}
function MobileCoverBrief(props: MobileCoverTitleProps) {
  const { game } = props;
  return (
    <div className="flex min-w-0 justify-between">
      <div>
        <p className={'mb-1 text-xs text-white_primary/60'}>{game.developer}</p>
        <p className={'flex items-center gap-[0.5ch] text-xs text-white_primary/60'}>
          <svg
            fill="none"
            stroke="hsl(0 0% 96% / 0.6)"
            width={14}
            height={14}
            className={'-translate-y-[1px]'}
          >
            <use strokeWidth={3} xlinkHref="/svg/sprites/actions.svg#star" />
          </svg>
          {game.avg_rating?.toString().split('.')[0] +
            '.' +
            game.avg_rating?.toString().split('.')[1].substring(0, 1)}
        </p>
      </div>
      <button className="rounded bg-white px-4 py-2 text-sm text-default">Buy now</button>
    </div>
  );
}
