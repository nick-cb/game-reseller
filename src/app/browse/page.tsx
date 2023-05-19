import React from "react";
import PortraitGameCard from "../components/PortraitGameCard";
import Pagination from "../components/Pagination";

const page = async ({
  searchParams,
}: {
  searchParams: { [K in string]: string | string[] | undefined };
}) => {
  const { keyword, filters, page } = searchParams;
  let limit = 20;
  let skip = 0;
  if (page && !isNaN(parseInt(page.toString()))) {
    const _skip = parseInt(page.toString());
    if (_skip > 0) {
      skip = (_skip - 1) * limit;
    }
  }
  const data = await fetch(
    `http://localhost:5001/api/products/games/all?limit=${20}&skip=${skip}${
      keyword ? "&keyword=" + keyword : ""
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...(filters
        ? {
            body: JSON.stringify({
              filters: (filters?.toString() || "")?.split(","),
            }),
          }
        : {}),
    }
  )
    .then((res) => res.json())
    .catch((e: Error) => {
      console.log(e);
      return e.message;
    });

  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-8">
      {data ? (
        <>
          {data.data &&
            Array.isArray(data?.data) &&
            data.data?.map((game: any) => (
              <PortraitGameCard key={game._id} game={game} />
            ))}
          {data.total_pages && <Pagination total={data.total_pages} />}
        </>
      ) : (
        <div>{data}</div>
      )}
    </div>
  );
};

export default page;
