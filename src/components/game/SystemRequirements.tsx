import React from "react";
import RequirementButton from "./RequirementButton";
import { Scroll, ScrollItem } from "@/components/scroll/index";

export default function SystemRequirements({ systems }: { systems: any[] }) {
  return (
    <Scroll containerSelector="#system-requirements">
      <ul className="mb-8 flex gap-8 overflow-scroll scrollbar-hidden">
        {systems.map((system, index) => {
          return (
            <li key={system.ID}>
              <RequirementButton system={system} index={index} />
            </li>
          );
        })}
      </ul>
      <ul
        id={"system-requirements"}
        className={
          "flex gap-8 " +
          " overflow-scroll snap-mandatory snap-x scrollbar-hidden "
        }
      >
        {systems.map((system) => {
          const recommended = system.details.filter(
            (detail: any) => !!detail.recommended,
          );
          return (
            <ScrollItem
              as="li"
              key={system.ID}
              className="grid grid-cols-2 gap-x-8 gap-y-4 w-full flex-shrink-0 snap-center"
            >
              <h3 className="text-sm">Minimum</h3>
              <h3 className="text-sm">
                {recommended.length > 0 && "Recommended"}
              </h3>
              {system.details.map((detail: any) => {
                return (
                  <React.Fragment key={detail.ID}>
                    {detail.minimum ? (
                      <div className="text-sm grid-cols-1">
                        <div className="text-white_primary/60">
                          {detail.title}
                        </div>
                        <div>{detail.minimum}</div>
                      </div>
                    ) : null}
                    {detail.recommended ? (
                      <div className="text-sm grid-cols-2">
                        <div className="text-white_primary/60">
                          {detail.title}
                        </div>
                        <div>{detail.recommended}</div>
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </ScrollItem>
          );
        })}
      </ul>
    </Scroll>
  );
}
