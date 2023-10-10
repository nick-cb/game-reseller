"use client";

import { usePathname, useRouter } from "next/navigation";
import StandardButton from "../StandardButton";
import { getLoggedInStatus } from "@/actions/users";
import { Game } from "@/database/models";

export function BuyNowButton({ game }: { game: Pick<Game, "ID" | "slug"> }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <StandardButton
      className="text-sm"
      onClick={async () => {
        const isLogin = await getLoggedInStatus();
        console.log({isLogin});
        if (!isLogin) {
          router.push(`/login?type=modal&order=${game.slug}`);
          return;
        }
        router.push(pathname + "/order?type=modal");
      }}
    >
      BUY NOW
    </StandardButton>
  );
}
