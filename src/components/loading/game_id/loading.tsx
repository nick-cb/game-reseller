import React from "react";

const loading = () => {
  return (
    <div className="pt-6 animate-pulse">
      <div className="text-2xl h-7 w-40 bg-white/25 rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-[min-content_auto] gap-4 lg:gap-8">
        <section className="col-start-1 col-end-3 row-start-1 row-end-2">
          <div className="flex overflow-hidden w-auto">
            <ul className="flex w-full">
              <li className="w-full shrink-0">
                <div className="relative w-full aspect-video bg-white/25 rounded" />
              </li>
            </ul>
          </div>
          <ul
            className="mt-4 overflow-hidden
          col-start-1 col-end-3
          flex gap-4 justify-center"
          >
            {Array(5)
              .fill(null)
              .map(() => (
                <li>
                  <div className="relative w-4 h-1 rounded sm:h-auto sm:w-24 sm:aspect-video bg-white/25"></div>
                </li>
              ))}
          </ul>
        </section>
        <section className="col-start-1 col-end-3">
          <div className="text-sm sm:text-base w-full h-4 sm:h-5 bg-white/25 mb-2 rounded" />
          <div className="text-sm sm:text-base w-full h-4 sm:h-5 bg-white/25 mb-2 rounded" />
          <div className="text-sm sm:text-base w-full h-4 sm:h-5 bg-white/25 mb-2 rounded" />
        </section>
        {/* <section className="col-start-1 col-end-3"> */}
        {/*   <article className="text-sm text-white/60 hover:text-white_primary transition-colors bg-white/25" /> */}
        {/* </section> */}
        <section
          className="w-full flex flex-col gap-4
          row-start-3 col-start-1 col-end-3
          sm:col-start-3 sm:row-start-1 sm:row-end-3"
        >
          <div className="relative w-full aspect-[3/2] hidden sm:block bg-white/25 rounded" />
          <p className="text-xs text-default h-5 w-12 bg-white/25 rounded" />
          <p className="text-white_primary h-5 w-40 rounded bg-white/25" />
          <div className="flex flex-col gap-2">
            <div className="w-full h-12 rounded bg-white/25" />
            <div className="text-sm h-9 w-full rounded bg-white/25" />
          </div>
          <div className="text-white text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="bg-white/25 h-4 w-24 rounded" />
              <p className="bg-white/25 h-4 w-28 rounded" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="bg-white/25 h-4 w-24 rounded" />
              <p className="bg-white/25 h-4 w-28 rounded" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="bg-white/25 h-4 w-24 rounded" />
              <p className="bg-white/25 h-4 w-28 rounded" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/20">
              <p className="bg-white/25 h-4 w-24 rounded" />
              <p className="bg-white/25 h-4 w-28 rounded" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default loading;
