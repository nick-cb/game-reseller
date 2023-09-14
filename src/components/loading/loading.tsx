import React from "react";

const arr = Array(5).fill(null);
const arr2 = Array(9).fill(null);
const loading = () => {
  return (
    <div>
      {arr.map((_, index) => (
        <section key={index} className="pb-8">
          <div className="text-white text-lg h-6 flex items-center group gap-2 pb-2 w-max pr-4" />
          <div
            className="grid gap-4
            grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 2xl:grid-cols-7 4xl:grid-cols-9"
          >
            {arr2.map((_, index) => (
              <div
                key={index}
                className="hidden first:block xs:[&:nth-child(-n+2)]:block
                sm:[&:nth-child(-n+3)]:block md:[&:nth-child(-n+4)]:block
                lg:[&:nth-child(-n+5)]:block 2xl:[&:nth-child(-n+7)]:block 4xl:[&:nth-child(-n+9)]:block"
              >
                <div className="group h-full flex flex-col justify-between animate-pulse">
                  <div className="relative aspect-[3/4] bg-white/25 rounded" />
                  <div className="mt-4 text-sm bg-white/25 h-4 rounded" />
                  <p className="text-xs mt-1 bg-white/25 w-28 h-3 rounded" />
                  <p className="text-sm mt-2 bg-white/25 w-10 h-4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default loading;
