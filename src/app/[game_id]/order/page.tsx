import { ItemOrder } from ".";

export default async function ItemOrderPage({ params }: { params: any }) {
  const { game_id: gameId } = params;
  console.log({ gameId });
  const data = await fetch(
    `http://localhost:5001/api/products/games/${gameId.replace("(.)", "")}`
  ).then((res) => res.json());
  console.log("order", { data });

  return (
    <>
      <ItemOrder game={data} />
    </>
  );
}
