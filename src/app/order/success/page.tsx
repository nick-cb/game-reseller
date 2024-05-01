import ShareActions from '@/actions2/share';
import { OrderItemDistribute } from '@/components/OrderItemDistribute';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const id = parseInt(searchParams['order_id']);
  const payload = await ShareActions.users.getUserInfoInCookie();
  if (!payload) {
    redirect('/');
  }
  const { data: order } = isNaN(id) ? { data: null } : await ShareActions.orders.findOrderByID(id);
  if (!order) {
    return <div>Order not found</div>;
  }
  const items = order.items;
  const firstItem = items[0];

  return (
    <div className="flex h-full items-center justify-center pt-[200px]">
      <div className={'flex gap-8'}>
        <div
          className={
            'flex flex-col items-center pt-2 ' +
            'w-[600px] pb-10 ' +
            'relative rounded bg-paper shadow shadow-black/25 '
          }
        >
          <Image
            src={'/you-rock.gif'}
            alt={'You rock'}
            width={400}
            height={200}
            className="mx-auto"
          />
          <br />
          <h2 className="mb-2 text-xl">Thank you for your order!</h2>
          <p className="text-white_primary/60">
            You can find your order{' '}
            <Link href={'/'} className="underline transition-colors hover:text-white_primary">
              here
            </Link>
          </p>
          {items.length === 1 ? (
            (() => {
              const shadowColor = firstItem.images.portraits[0].colors.highestSat;
              return (
                <Image
                  src={firstItem.images.portraits[0].url}
                  width={150}
                  height={200}
                  alt={firstItem.name}
                  title={firstItem.name}
                  className={
                    'absolute right-10 top-10 -translate-y-1/2 translate-x-1/2 -rotate-[30deg] rounded ' +
                    '[--tw-shadow-colored:0_10px_25px_-3px_var(--tw-shadow-color),_0_-2px_10px_0px_var(--tw-shadow-color),_0_4px_6px_-4px_var(--tw-shadow-color)] '
                  }
                  style={{
                    boxShadow: `var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 10px 25px -3px rgb(${shadowColor}), 0 -2px 10px 0px rgb(${shadowColor}), 0 4px 6px -4px rgb(${shadowColor})`,
                  }}
                />
              );
            })()
          ) : (
            <OrderItemDistribute gameList={items} />
          )}
        </div>
      </div>
    </div>
  );
}
