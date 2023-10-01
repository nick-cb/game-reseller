"use client";

// import { useRouter } from "next/navigation";
import StandardButton from "../StandardButton";
// import { getLoggedInStatus } from "@/actions/users";
import { Game } from "@/database/models";

export function BuyNowButton({ game }: { game: Pick<Game, "ID" | "slug"> }) {
  // const router = useRouter();

  return (
    <StandardButton
      className="text-sm"
      onClick={async () => {
        // const isLogin = await getLoggedInStatus();
        // if (!isLogin) {
        //   router.push(`/login?type=modal&order=${game.slug}`);
        // }
      }}
    >
      BUY NOW
    </StandardButton>
  );
}
