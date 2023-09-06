"use client";

import React, { useRef, useState } from "react";

export default function SystemRequirements({ systems }: { systems: any[] }) {
  const detailContainerRef = useRef<HTMLUListElement>(null);
  const [_systems, setSystems] = useState(
    systems.map((system, index) => {
      return {
        ...system,
        active: index === 0 ? true : false,
      };
    })
  );

  return (
    <>
      <ul className="mb-8 flex gap-8">
        {_systems.map((system, index) => {
          return (
            <li key={system.ID}>
              <button
              onClick={() => {
                if (detailContainerRef.current) {
                  detailContainerRef.current?.scroll({
                    left: index * detailContainerRef.current.clientWidth,
                    behavior: 'smooth',
                  })
                  setSystems((prev) => {
                    const prevActiveIndex = prev.findIndex(p => !!p.active);
                    if (prevActiveIndex > -1) {
                      prev[prevActiveIndex].active = false;
                    }
                    prev[index].active = true;
                    return [...prev];
                  })
                }
              }}
                className={
                  "rounded-t border-b-[3px] py-7 px-2 text-sm font-bold uppercase " +
                  " transition-colors " +
                  (system.active
                    ? " border-b-white "
                    : " border-b-paper  hover:border-b-white/60 ")
                }
              >
                <label>{system.os}</label>
              </button>
            </li>
          );
        })}
      </ul>
      <ul
        ref={detailContainerRef}
        className={
          "flex gap-8 " +
          " overflow-scroll snap-mandatory snap-x scrollbar-hidden "
        }
      >
        {_systems.map((system) => {
          const minimum = system.details.filter(
            (detail: any) => !!detail.minimum
          );
          const recommended = system.details.filter(
            (detail: any) => !!detail.recommended
          );
          return (
            <li
              key={system.ID}
              className="grid grid-cols-2 gap-x-8 gap-y-4 w-full flex-shrink-0 snap-center"
            >
              <h3 className="text-sm">Minimum</h3>
              <h3 className="text-sm">
                {recommended.length > 0 && "Recommended"}
              </h3>
              {system.details.map((detail: any) => {
                return (
                  <>
                    <div key={detail.ID} className="text-sm">
                      <div className="text-white_primary/60">
                        {detail.title}
                      </div>
                      <div>{detail.minimum}</div>
                    </div>
                    <div key={detail.ID} className="text-sm">
                      {detail.recommended && (
                        <>
                          <div className="text-white_primary/60">
                            {detail.title}
                          </div>
                          <div>{detail.recommended}</div>
                        </>
                      )}
                    </div>
                  </>
                );
              })}
            </li>
          );
        })}
      </ul>
    </>
  );
}
