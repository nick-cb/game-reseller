import React from 'react';
import RequirementButton from './RequirementButton';
import { ScrollItem } from '@/components/scroll/ScrollPrimitive';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '@/components/intersection/IntersectionObserver';
import { Text } from '@/components/Typography';

export default function SystemRequirements({ systems }: { systems: any[] }) {
  return (
    <IntersectionObserverContainer>
      <ul className="scrollbar-hidden mb-8 flex gap-8 overflow-scroll">
        {systems.map((system, index) => {
          return (
            <li key={system.ID}>
              <RequirementButton system={system} index={index} />
            </li>
          );
        })}
      </ul>
      <IntersectionObserverRoot>
        <ul className="scrollbar-hidden flex snap-x snap-mandatory gap-8 overflow-scroll">
          {systems.map((system, index) => {
            const recommended = system.details.filter((detail: any) => !!detail.recommended);
            return (
              <ScrollItem
                key={system.ID}
                index={index}
                className="grid w-full flex-shrink-0 snap-center auto-rows-min grid-cols-2 gap-x-8 gap-y-4"
              >
                <Text as="h3">Minimum</Text>
                <Text as="h3">{recommended.length > 0 && 'Recommended'}</Text>
                {system.details.map((detail: any) => {
                  return (
                    <React.Fragment key={detail.ID}>
                      {detail.minimum ? (
                        <div className="h-min grid-cols-1 text-sm">
                          <Text dim>{detail.title}</Text>
                          <Text>{detail.minimum}</Text>
                        </div>
                      ) : null}
                      {detail.recommended ? (
                        <div className="h-min grid-cols-2 text-sm">
                          <Text dim>{detail.title}</Text>
                          <Text>{detail.recommended}</Text>
                        </div>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </ScrollItem>
            );
          })}
        </ul>
      </IntersectionObserverRoot>
    </IntersectionObserverContainer>
  );
}
