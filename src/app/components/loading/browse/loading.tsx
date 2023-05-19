import React from "react";

const arr = Array(20).fill(null);
const loading = () => {
  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-8">
      {arr.map(() => (
        <figure className="group cursor-pointer h-full flex flex-col justify-between animate-pulse">
          <div className="relative aspect-[3/4] bg-white/25 rounded" />
          <figcaption className="mt-4 w-40 h-5 bg-white/25 rounded" />
          <p className="text-xs mt-1 w-28 h-4 bg-white/25 rounded" />
          <p className="text-sm mt-2 w-10 h-5 bg-white/25 rounded" />
        </figure>
      ))}
    </div>
  );
};

export default loading;
