import { ItemOrder } from "@/app/[slug]/order";
import { Dialog } from "@/components/Dialog";

export default async function ItemOrderModal({ params }: { params: any }) {
  const { game_id: gameId } = params;
  const data = await fetch(
    `http://localhost:5001/api/products/games/${gameId?.replace("(.)", "")}`,
  )
    .then((res) => res.json())
    .catch((error) => error);
  console.log("modal", { data });

  return (
    <Dialog>
      <ItemOrder game={data} clientSecret={""} />
    </Dialog>
  );
}
