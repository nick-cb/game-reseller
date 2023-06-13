import Carousel from "@/components/discover/Carousel";
import Link from "next/link";

const getCollections = async (names: string[]) => {
  const data = await fetch(
    new URL(
      `http://localhost:5001/api/collections/name?names[]=${names.join(
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
    <>
      {data.map((collection: any) => (
        <section key={collection._id} className="pb-8 relative">
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
          <Carousel data={collection.list_game} />
        </section>
      ))}
    </>
  );
}
