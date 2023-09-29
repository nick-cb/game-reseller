import React from "react";
import PortraitGameCard from "@/components/PortraitGameCard";
import Pagination from "@/components/Pagination";
import { groupGameByTags } from "@/database/repository/game/select";
import { groupImages } from "@/utils/data";
import Filter from "@/components/browse/Filter";

const page = async ({
  searchParams,
}: {
  searchParams: { [K in string]: string | string[] | undefined };
}) => {
  const { keyword, filters, page } = searchParams;
  let limit = 16;
  let skip = 0;
  if (page && !isNaN(parseInt(page.toString()))) {
    const _skip = parseInt(page.toString());
    if (_skip > 0) {
      skip = _skip - 1;
    }
  }
  const response = await groupGameByTags({
    tags: typeof filters === "string" ? filters?.split(",") : [],
    limit,
    skip,
    keyword: keyword as string,
  });
  const data = response.data.map((game) => {
    return {
      ...game,
      images: groupImages(game.images),
    };
  });

  return (
    <>
      {data ? (
        <>
          <div className="flex justify-end pb-4">
            <Filter />
          </div>
          <div
            className="grid grid-cols-2 3/4sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 
            "
          >
            {data &&
              Array.isArray(data) &&
              data.map((game: any) => (
                <PortraitGameCard
                  key={game._id}
                  game={game}
                  className="snap-start block"
                />
              ))}
            {response.total && (
              <Pagination
                total={Math.ceil(response.total / 32)}
                // @ts-ignore
                currentPage={parseInt(page?.toString())}
                className="col-start-1 col-end-3 3/4sm:col-end-4 lg:col-end-5"
              />
            )}
          </div>
        </>
      ) : (
        <div>{data}</div>
      )}
    </>
  );
};

export default page;
