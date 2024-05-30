import { currencyFormatter } from '@/utils';
import Image from 'next/image';

export function MobileGameList({
  gameList,
}: {
  gameList: (Pick<Game, 'ID' | 'name' | 'developer' | 'sale_price'> & {
    images: GameImageGroup;
  })[];
}) {
  return (
    <div className="md:hidden">
      <h2 className="mb-4 text-lg uppercase">Order summary</h2>
      <ul className="flex flex-col gap-2">
        {gameList.map((game) => {
          return (
            <li key={game.ID} className={'flex w-full gap-4 rounded bg-paper px-3 py-2 '}>
              <Image
                src={game?.images.portraits[0]?.url}
                alt={''}
                width={50}
                height={70}
                className="rounded"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm text-white_primary">{game.name}</p>
                  <p className="text-xs text-white_primary/60">{game.developer}</p>
                </div>
                <p>{currencyFormatter(game.sale_price)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
