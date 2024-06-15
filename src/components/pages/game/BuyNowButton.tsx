'use client';

import { usePathname, useRouter } from 'next/navigation';
import UserActions from '@/+actions/users-actions';
import { Button } from '@/components/Buttons';

export function BuyNowButton({ game }: { game: Pick<Game, 'ID' | 'slug'> }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      onClick={async () => {
        const isLogin = await UserActions.users.checkLoginStatus();
        if (!isLogin) {
          router.push(`/login?type=modal&order=${game.slug}`);
          return;
        }
        router.push(pathname + '/order?type=modal');
      }}
    >
      BUY NOW
    </Button>
  );
}
