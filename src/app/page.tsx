import Image from "next/image";
import Link from "next/link";

const getCollections = async (names: string[]) => {
  const data = await fetch(
    new URL(
      `https://web-shop-ban-game-server.onrender.com/api/collections/name?names[]=${names.join(
        "&names[]="
      )}`
    )
  ).then((res) => res.json());
  return data;
};

export default async function Home() {
  const data = await getCollections([
    "top+sale",
    "new+release",
    "most+popular",
    "recently+update",
  ]);

  return (
    <div>
      {data.map((collection: any) => (
        <section key={collection._id} className="pb-8">
          <Link
            className="text-white text-lg flex items-center group gap-2 pb-2 w-max pr-4"
            href={`/browse?category=${collection._id}`}
          >
            {collection.name[0].toUpperCase() + collection.name.substring(1)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="14px"
              height="14px"
              className="group-hover:translate-x-2 transition-transform mt-[2px]"
            >
              <g id="Icon">
                <path
                  fill="white"
                  d="M5.53,14.53l6,-6c0.293,-0.293 0.293,-0.767 0,-1.06l-6,-6c-0.292,-0.293 -0.768,-0.293 -1.06,-0c-0.293,0.292 -0.293,0.768 -0,1.06l5.469,5.47c0,0 -5.469,5.47 -5.469,5.47c-0.293,0.292 -0.293,0.768 -0,1.06c0.292,0.293 0.768,0.293 1.06,0Z"
                />
              </g>
            </svg>
          </Link>
          <div
            className="grid gap-4
            grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 2xl:grid-cols-7 4xl:grid-cols-9"
          >
            {collection.list_game.map((game: any) => (
              <Link
                href={`/${game._id}`}
                key={game._id}
                className="hidden first:block xs:[&:nth-child(-n+2)]:block
                sm:[&:nth-child(-n+3)]:block md:[&:nth-child(-n+4)]:block
                lg:[&:nth-child(-n+5)]:block 2xl:[&:nth-child(-n+7)]:block 4xl:[&:nth-child(-n+9)]:block"
              >
                <figure className="group cursor-pointer h-full flex flex-col justify-between">
                  <div
                    className="relative aspect-[3/4]
                    after:rounded after:absolute after:inset-0 after:w-full after:h-full 
                    after:transition-opacity after:bg-white after:opacity-0 
                    group-hover:after:opacity-[0.1]
                    "
                  >
                    <Image
                      src={
                        game.images.find((img: any) => {
                          return img.type === "portrait";
                        })?.url
                      }
                      alt={`portrait of ${game.name}`}
                      className={"rounded relative"}
                      fill
                    />
                  </div>
                  <figcaption className="mt-4 text-sm text-white_primary">
                    {game.name}
                  </figcaption>
                  <p className="text-xs mt-1 text-white/60">{game.developer}</p>
                  <p className="text-sm mt-2 text-white_primary">
                    ${game.sale_price}
                  </p>
                </figure>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
