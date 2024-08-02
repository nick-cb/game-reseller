import { MoneyFormatter } from '@/components/MoneyFormatter';
import { Text } from '@/components/Typography';
import Image from 'next/image';

type OrderSummaryProps = {
  totalAmount: number;
  gameList: (Pick<Game, 'ID' | 'name' | 'sale_price' | 'developer'> & {
    images: GameImageGroup;
  })[];
};
export function OrderSummary(props: OrderSummaryProps) {
  const { gameList, totalAmount } = props;
  return (
    <div>
      <h2 className="mb-4 text-lg uppercase">Order summary</h2>
      <ul className="scrollbar-hidden flex max-h-[430px] flex-col gap-4 overflow-scroll">
        {gameList.map((game) => {
          return (
            <li key={game.ID} className={'flex gap-4'}>
              <Image
                src={game?.images.portraits[0]?.url}
                alt={''}
                width={128}
                height={280}
                className="rounded object-cover"
              />
              <div className="flex flex-col">
                <Text size="base" className="font-bold">
                  {game.name}
                </Text>
                <Text dim>{game.developer}</Text>
                <Text className="mt-4 block">
                  <MoneyFormatter amount={game.sale_price} />
                </Text>
              </div>
            </li>
          );
        })}
      </ul>
      <hr className="my-8 border-white_primary/60" />
      <div className="flex items-center justify-between">
        <Text size="base">Total</Text>
        <Text size="base">
          <MoneyFormatter amount={totalAmount} />
        </Text>
      </div>
    </div>
  );
}
