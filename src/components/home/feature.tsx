import { groupImages } from "@/utils/data";
import { FeatureCard } from "../HoverPlayVideo";
import { Scroll, ScrollItem } from "../scroll";
import { getCollectionByKey2 } from "@/actions/collections";
import { Suspense } from "react";

export async function Feature() {
  const { data } = await getCollectionByKey2(["feature"]);
  const feature = data[0];

  return (
    <Scroll containerSelector="#feature-mobile-scroll-list">
      <section>
        <ul
          id={"feature-mobile-scroll-list"}
          className={
            "flex gap-8 overflow-scroll scrollbar-hidden snap-x snap-mandatory"
          }
        >
          {feature?.list_game.slice(0, 3).map((item) => {
            return (
              <ScrollItem
                as="li"
                key={item.ID}
                className="sm:w-full group cursor-pointer w-4/5 flex-shrink-0 sm:flex-shrink snap-center first-of-type:snap-start"
              >
                <Suspense>
                  <FeatureCard
                    key={item.ID}
                    item={{ ...item, images: groupImages(item.images) } as any}
                  />
                </Suspense>
              </ScrollItem>
            );
          })}
        </ul>
      </section>
    </Scroll>
  );
}
