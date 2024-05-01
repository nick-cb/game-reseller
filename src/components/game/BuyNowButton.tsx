'use client';

import { usePathname, useRouter } from 'next/navigation';
import StandardButton from '../StandardButton';
import { Game } from '@/database/models/model';
import ShareActions from '@/actions/share';

export function BuyNowButton({ game }: { game: Pick<Game, 'ID' | 'slug'> }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <StandardButton
      className="text-sm"
      onClick={async () => {
        const isLogin = await ShareActions.users.checkLoginStatus();
        if (!isLogin) {
          router.push(`/login?type=modal&order=${game.slug}`);
          return;
        }
        router.push(pathname + '/order?type=modal');
      }}
    >
      BUY NOW
    </StandardButton>
  );
}
