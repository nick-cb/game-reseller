import Carousel from "@/components/discover/Carousel";
import Link from "next/link";
import HeroCarousel from "@/components/home/hero_carousel/HeroCarousel";
import Image from "next/image";
import {Pillar} from "@/components/home/pillar";

const getCollections = async (names: string[]) => {
  const data = await fetch(
    new URL(
      `http://localhost:5001/api/collections/name?names[]=${names.join(
        "&names[]="
      )}`
    ),
    {
      cache: "no-store",
    }
  ).then((res) => res.json());
  return data;
};

export default async function Home() {
  const data: any[] = await getCollections([
    "top+sale",
    "new+release",
    "most+popular",
    "recently+update",
  ]);
  console.log(data);

  return (
    <>
      <HeroCarousel data={data} />
      <hr className="my-4 border-default" />
      {data.slice(1, 2).map((collection: any) => (
        <Carousel collection={collection} className="pb-8 relative" />
      ))}
      <hr className="my-4 border-default" />
      <section>
        <ul className={"flex gap-8"}>
          <li className="w-full group cursor-pointer">
            <Link href={"#"}>
              <div
                className={`relative overflow-hidden aspect-video cols-min-1
                  after:rounded after:absolute after:inset-0 after:w-full after:h-full
                  after:transition-opacity after:bg-white after:opacity-0
                  group-hover:after:opacity-[0.1] bg-white/25 rounded
                  `}
              >
                <Image
                  className="rounded"
                  src="https://cdn2.unrealengine.com/egs-valorant-ep-7-act-1-breaker-1920x1080-39b521ddfc68.jpg"
                  alt={""}
                  fill
                />
              </div>
              <h2 className="text-white_primary py-4">VALORANT</h2>
              <p className="text-white/60 text-sm mb-2">
                Adapt. Overcome. Evolve. Come and ensnare your prey with
                Norwegian Agent Deadlock in EP_07: EVOLUTION // ACT I.
              </p>
              <p>Free</p>
            </Link>
          </li>
          <li className="w-full group cursor-pointer">
            <Link href={"#"}>
              <div
                className={`relative overflow-hidden aspect-video
                  after:rounded after:absolute after:inset-0 after:w-full after:h-full
                  after:transition-opacity after:bg-white after:opacity-0
                  group-hover:after:opacity-[0.1] bg-white/25 rounded
                  `}
              >
                <Image
                  className="rounded"
                  src="https://cdn2.unrealengine.com/egs-ratchet-and-clank-rift-apart-breaker-1920x1080-c3c113bb27fd.jpg"
                  alt={""}
                  fill
                />
              </div>
              <h2 className="text-white_primary py-4">
                Ratchet and Clank: Rift Apart - Coming July 26
              </h2>
              <p className="text-white/60 text-sm mb-2">
                Go dimension-hopping and take on an evil emperor from another
                reality. Pre-purchase now to get early access in-game items.
              </p>
              <p>Free</p>
            </Link>
          </li>
          <li className="w-full group cursor-pointer">
            <Link href={"#"}>
              <div
                className={`relative overflow-hidden aspect-video
                  after:rounded after:absolute after:inset-0 after:w-full after:h-full
                  after:transition-opacity after:bg-white after:opacity-0
                  group-hover:after:opacity-[0.1] bg-white/25 rounded
                  `}
              >
                <Image
                  className="rounded"
                  src="https://cdn2.unrealengine.com/egs-amnesia-the-bunker-pdp-breaker-1920x1080-0e84b62b2744.jpg"
                  alt={""}
                  fill
                />
              </div>
              <h2 className="text-white_primary py-4">Amnesia: The Bunker</h2>
              <p className="text-white/60 text-sm mb-2">
                Overcome fear, persevere, and make your way out alive.
              </p>
              <p>Fee</p>
            </Link>
          </li>
        </ul>
      </section>
      <hr className="my-6 border-default" />
      <section className="flex gap-8 w-[calc(100%_+_8px)] -translate-x-2">
        <Pillar data={data.find(c => c.name === "top sale")} />
        <Pillar data={data.find(c => c.name === "most popular")} />
        <Pillar data={data.find(c => c.name === "new release")} />
      </section>
    </>
  );
}
