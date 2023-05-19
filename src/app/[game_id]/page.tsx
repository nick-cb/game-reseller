import React from "react";
import Image from "next/image";
import Gamecard from "../components/game/gamecard";

const page = async ({ params }: { params: any }) => {
  const { game_id: gameId } = params;
  const data = await fetch(
    `http://localhost:5001/api/products/games/${gameId}`
  ).then((res) => res.json());
  const landscapeImages = (data.images || []).filter(
    (image: any) => image.type === "landscape"
  );

  return (
    <div className="pt-6">
      <h1 className="text-2xl text-white_primary pb-6">{data.name}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-[min-content_auto] gap-4 lg:gap-8">
        <section className="col-start-1 col-end-3 row-start-1 row-end-2">
          <div className="flex overflow-hidden w-auto">
            <ul className="flex w-full">
              {landscapeImages.map((image: any) => (
                <li className="w-full shrink-0">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={image.url}
                      alt={`${data.type} of ${data.name}`}
                      className="rounded"
                      fill
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ul
            className="mt-4 overflow-hidden
          col-start-1 col-end-3
          flex gap-4 justify-center"
          >
            {landscapeImages.map((image: any) => (
              <li>
                <div className="relative w-4 h-1 rounded bg-paper sm:h-auto sm:w-24 sm:aspect-video">
                  <Image
                    src={image.url}
                    alt={`${data.type} of ${data.name}`}
                    className="rounded hidden sm:block"
                    fill
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="col-start-1 col-end-3">
          <summary className="text-sm sm:text-base list-none text-white_primary">
            {data.title}
          </summary>
          <div className="border-l border-white/60 pl-4 py-3 mt-4">
            <p className="text-sm text-white/60">Genres</p>
            <p className="text-white text-sm">
              {data.tag
                .map((tag: string) => tag[0].toUpperCase() + tag.substring(1))
                .join(", ")}
            </p>
          </div>
        </section>
        <section className="col-start-1 col-end-3">
          <article className="text-sm text-white/60 hover:text-white_primary transition-colors">
            {data.description}
          </article>
        </section>
        {data.included_in.length > 0 && (
          <section className="col-start-1 col-end-3">
            <h2 className="text-xl text-white_primary pb-4">Editions</h2>
            <div className="flex flex-col gap-4">
              {data.included_in.map((edition: any) => (
                <Gamecard game={edition} type="edition" />
              ))}
            </div>
          </section>
        )}
        {data.includes.length > 0 && (
          <section className="col-start-1 col-end-3">
            <h2 className="text-xl text-white_primary pb-4">Add-on</h2>
            {data.includes.map((edition: any) => (
              <Gamecard game={edition} type="add-on" />
            ))}
          </section>
        )}
        <section
          className="w-full flex flex-col gap-4
          row-start-3 col-start-1 col-end-3
          sm:col-start-3 sm:row-start-1 sm:row-end-3"
        >
          <div className="relative w-full aspect-[3/2] hidden sm:block">
            <Image
              src={
                data.images.find((img: any) => {
                  return img.type === "logo";
                })?.url
              }
              fill
              alt={`logo of ${data.name}`}
              className="object-contain"
            />
          </div>
          <p className="text-xs bg-yellow-300 text-default px-2 py-1 w-max rounded">
            {data.included_in.length > 0 ? "Add-on" : "Base game"}
          </p>
          <p className="text-white_primary">${data.sale_price}</p>
          <div className="flex flex-col gap-2">
            <button
              className="w-full py-4 rounded
              bg-primary text-white shadow-white/10 shadow-md hover:brightness-105 transition-[filter]"
            >
              Buy now
            </button>
            <button
              className="text-sm py-2 w-full rounded border
              border-white/60 text-white hover:bg-paper transition-colors"
            >
              Add to cart
            </button>
          </div>
          <div className="text-white text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="text-white/60">Developer</p>
              <p className="text-white_primary">{data.developer}</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="text-white/60">Publisher</p>
              <p className="text-white_primary">{data.publisher}</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="text-white/60">Release Date</p>
              <p className="text-white_primary">
                {new Date(data.release_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="text-white/60">Platform</p>
              <p className="text-white_primary">{data.platform}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
