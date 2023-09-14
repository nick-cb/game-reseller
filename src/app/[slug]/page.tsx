import React from "react";
import Image from "next/image";
import StandardButton from "@/components/StandardButton";
import ReactMarkdown from "react-markdown";
import { getLoggedInStatus } from "@/actions/users";
import { redirect } from "next/navigation";
import remarkBreaks from "remark-breaks";
import ExpandableDescription from "@/components/ExpandableDescription";
import LinearCarousel from "@/components/game/LinearCarousel";
import rehypeRaw from "rehype-raw";
import SystemRequirements from "@/components/game/SystemRequirements";
import Scroll, { Item } from "@/components/Scroll";
import {
  ScrollBulletIndicator,
} from "@/components/home/hero-slider";
import {connectDB} from "@/database";
import {findGameBySlug} from "@/database/repository/game/select";

const criticRec = {
  weak: "51.548667764616276",
  fair: "51.548667764616276, 5, 51.548667764616276",
  strong: "51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276",
  mighty:
    "51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276",
};

const page = async ({ params }: { params: any }) => {
  const { slug } = params;
  const db = await connectDB();
  const response = await findGameBySlug(slug);

  const game = response[0][0];
  /*const mappingResponse = await db.execute(sql`
select *, gi.images
from games
         left join (select game_id,
                           json_arrayagg(json_object('ID', gi.ID, 'type', gi.type, 'pos_row', gi.pos_row, 'alt', gi.alt,
                                                     'url', gi.url)) as images
                    from game_images gi
                    group by game_id) gi on games.ID = gi.game_id
where base_game_id = ${game.type === "base_game" ? game.ID : game.base_game_id};
`);*/
/*  const editions = mappingResponse[0].filter((g) => g.type.includes("edition"));
  const dlc = mappingResponse[0].filter((g) => g.type.includes("dlc"));
  const addOns = mappingResponse[0].filter((g) => g.type.includes("add_on"));
  const dlcAndAddons = dlc.concat(addOns);*/
  console.info({response});

  const landscapeImages = game.images.reduce((acc: any[], curr: any) => {
    const type = curr.type.toLowerCase();
    if (
      (type.includes("wide") ||
        type.includes("carousel") ||
        type.includes("feature")) &&
      !type.includes("video")
    ) {
      const segments = curr.url.split("-");
      const id = segments[segments.length - 1];
      if (acc.some((item) => item.url.includes(id))) {
        return acc;
      }
      acc.push(curr);
      return acc;
    }
    return acc;
  }, []);

  const buyNow = async () => {
    "use server";
    const status = await getLoggedInStatus();
    if (!status) {
      redirect(`/login?gameId=${game.ID}`);
    }
    redirect(`/${game.ID}/order`);
  };

  return (
    <div className="pt-6">
      <h1 className="text-2xl text-white_primary pb-6">{game.name}</h1>
      <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 grid-rows-[min-content_auto] gap-4 md:gap-8 lg:gap-16">
        <section className="col-start-1 col-span-full md:[grid-column:-3/1] row-start-1 row-end-2">
          <Scroll containerSelector="#linear-carousel">
            <LinearCarousel videos={game.videos} images={landscapeImages} />
          </Scroll>
        </section>
        <section
          className="w-full 
          row-start-3 md:row-start-1 sm:row-end-4 
          col-span-3 md:[grid-column:-1/-3] md:col-start-3 md:col-end-4"
        >
          <div className="flex flex-col gap-4 md:sticky top-[116px]">
            <div className="relative w-full aspect-[3/2] hidden md:block">
              <Image
                src={
                  game.images.find((img: any) => {
                    return img.type.toLowerCase().includes("logo");
                  })?.url
                }
                fill
                alt={`logo of ${game.name}`}
                className="object-contain"
              />
            </div>
            {/* <p className="text-xs bg-yellow-300 text-default px-2 py-1 w-max rounded"> */}
            {/*   {game.included_in.length > 0 ? "Add-on" : "Base game"} */}
            {/* </p> */}
            <p className="text-white_primary">
              {game.sale_price > 0 ? "$" + game.sale_price : "Free"}
            </p>
            <div className="flex flex-col gap-2">
              <form action={buyNow}>
                <StandardButton type="submit" className="text-sm">
                  BUY NOW
                </StandardButton>
              </form>
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
                <p className="text-white_primary">{game.developer}</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <p className="text-white/60">Publisher</p>
                <p className="text-white_primary">{game.publisher}</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <p className="text-white/60">Release Date</p>
                <p className="text-white_primary">
                  {new Date(game.release_date).toLocaleDateString()}
                </p>
              </div>
              {/* <div className="flex justify-between items-center py-2 border-b border-white/20"> */}
              {/*   <p className="text-white/60">Platform</p> */}
              {/*   <p className="text-white_primary"> */}
              {/*     {(Object.keys(game.requirements?.systems) || []).map( */}
              {/*       (system) => system */}
              {/*     )} */}
              {/*   </p> */}
              {/* </div> */}
            </div>
          </div>
        </section>
        <section className="col-span-full md:[grid-column:-3/1]">
          <summary className="text-sm sm:text-base list-none text-white_primary">
            {game.description}
          </summary>
          <div className="flex gap-8 justify-between">
            <div className="border-l border-white/60 pl-4 py-3 mt-4 w-full">
              <p className="text-sm text-white/60">Genres</p>
              <p className="text-white text-sm">
                {game.tags
                  .filter((tag) => tag.group_name === "genre")
                  .map(
                    (tag: any) =>
                      tag.name[0].toUpperCase() + tag.name.substring(1)
                  )
                  .join(", ")}
              </p>
            </div>
            <div className="border-l border-white/60 pl-4 py-3 mt-4 w-full">
              <p className="text-sm text-white/60">Features</p>
              <p className="text-white text-sm">
                {game.tags
                  .filter((tag) => tag.group_name === "feature")
                  .map(
                    (tag: any) =>
                      tag.name[0].toUpperCase() + tag.name.substring(1)
                  )
                  .join(", ")}
              </p>
            </div>
          </div>
        </section>
        <section className="col-span-full md:[grid-column:-3/1]">
          <ExpandableDescription>
            <article className="text-sm text-white_primary/60 hover:text-white_primary/80 transition-colors">
              <ReactMarkdown
                components={{ p: "div", h1: "h2" }}
                className="description-container"
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
              >
                {game.long_description}
              </ReactMarkdown>
            </article>
          </ExpandableDescription>
        </section>
        {/*{editions.length > 0 ? (
          <>
            <section className="col-start-1 col-span-full xl:[grid-column:-3/1]">
              <h2 className="text-xl text-white_primary pb-4">Editions</h2>
              {editions.map((edition: any) => (
                <>
                  <div className="flex flex-col gap-4">
                    <GameCard game={edition} type="edition" />
                  </div>
                  <br className="last:hidden" />
                </>
              ))}
            </section>
          </>
        ) : null}
        {dlcAndAddons.length > 0 ? (
          <>
            <section className="col-start-1 col-span-full xl:[grid-column:-3/1]">
              <h2 className="text-xl text-white_primary pb-4">Add-ons</h2>
              {dlcAndAddons.slice(0, 3).map((edition: any) => (
                <>
                  <div className="flex flex-col gap-4">
                    <GameCard game={edition} type="add-on" />
                  </div>
                  <br className="last:hidden" />
                </>
              ))}
              {dlcAndAddons.length > 3 ? (
                <Link
                  href={"#"}
                  className="w-full text-center py-4 block rounded text-sm
                  border border-white_primary/60 
                  hover:bg-paper transition-colors"
                >
                  See more
                </Link>
              ) : null}
            </section>
          </>
        ) : null}
        {game.avg_rating && (
          <section className="col-start-1 col-span-full xl:[grid-column:-3/1]">
            <h2 className="text-xl pb-4">Player Ratings</h2>
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const remainder =
                  game.avg_rating < starIndex ? game.avg_rating % 1 : 0;
                const starId = "star-rating-id-" + starIndex;
                return (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg"
                    viewBox="0 0 36 34"
                    width={36}
                    height={36}
                    data-index={remainder}
                    stroke="rgb(245, 245, 245)"
                    strokeWidth={1}
                  >
                    {remainder && (
                      <defs>
                        <linearGradient id={starId} x1="0" y1="0" x2="1" y2="0">
                          <stop
                            stopColor="rgb(245, 245, 245)"
                            offset={remainder.toString()}
                          ></stop>
                          <stop
                            className="text-transparent"
                            stopColor="currentColor"
                            offset={remainder.toString()}
                          ></stop>
                        </linearGradient>
                      </defs>
                    )}
                    <path
                      d="M17.7835 1.05234C17.8961 0.714958 18.3733 0.714958 18.4859 1.05234L22.4334 12.8804C22.4839 13.0316 22.6253 13.1335 22.7846 13.1335H35.5375C35.8985 13.1335 36.0461 13.5975 35.7513 13.806L25.4512 21.0917C25.318 21.1859 25.2622 21.3563 25.3138 21.5112L29.2521 33.3116C29.3654 33.651 28.9792 33.9377 28.6871 33.7311L18.3485 26.4182C18.2204 26.3276 18.049 26.3276 17.9209 26.4182L7.58236 33.7311C7.29026 33.9377 6.90407 33.651 7.01734 33.3116L10.9556 21.5112C11.0073 21.3563 10.9515 21.1859 10.8182 21.0917L0.518159 13.806C0.223381 13.5975 0.370904 13.1335 0.731971 13.1335H13.4848C13.6441 13.1335 13.7856 13.0316 13.836 12.8804L17.7835 1.05234Z"
                      fill={remainder ? `url(#${starId})` : "currentColor"}
                    ></path>
                  </svg>
                );
              })}
            </div>
          </section>
        )}*/}
        {game.polls && (
          <section className="col-start-1 col-span-full xl:[grid-column:-3/1] grid grid-cols-2 gap-8">
            {game.polls.slice(0, 6).map((poll: any) => {
              return (
                <div
                  className={
                    "bg-paper rounded-md " +
                    " flex xl:flex-col items-center xl:justify-center " +
                    " gap-4 xl:gap-0 p-4 xl:p-0 xl:aspect-[4/3] "
                  }
                >
                  <Image
                    src={poll.result_emoji}
                    width={42}
                    height={42}
                    alt={poll.result_title}
                    className="xl:mb-4"
                  />
                  <div className="xl:flex flex-col justify-center items-center">
                    <p className="mb-1 xl:mb-2 text-xs md:text-sm text-white_primary/60">
                      {poll.result_text}
                    </p>
                    <p className="text-bold text-sm md:text-base">
                      {poll.result_title}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        )}
        {game.reviews.length > 0 && (
          <section className="col-start-1 col-span-full xl:[grid-column:-3/1]">
            <h2 className="text-xl text-white_primary pb-4">{game.name} Ratings & Reviews</h2>
            <ul className="flex gap-4 mb-4">
              {game.critic_pct && (
                <li className=" flex flex-col items-center">
                  <div className="relative w-max">
                    <svg
                      viewBox="0 0 75 75"
                      height="75"
                      width="75"
                      version="1.1"
                      className="-rotate-90 mb-1"
                      fill="none"
                    >
                      <circle
                        strokeWidth="3"
                        cx="50%"
                        cy="50%"
                        r="36"
                        className="text-paper"
                        stroke="currentColor"
                        fill="none"
                      ></circle>
                      <circle
                        strokeWidth="3"
                        cx="50%"
                        cy="50%"
                        r="36"
                        stroke="rgb(242, 191, 86)"
                        strokeDasharray="226.1946710584651, 226.1946710584651"
                        strokeDashoffset={100 - game.critic_pct}
                      ></circle>
                    </svg>
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
                      {game.critic_pct + "%"}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base mt-2 text-center">Critics Recommend</p>
                </li>
              )}
              {game.critic_avg && (
                <li className=" flex flex-col items-center">
                  <div className="relative w-max">
                    <svg
                      viewBox="0 0 75 75"
                      height="75"
                      width="75"
                      version="1.1"
                      className="-rotate-90 mb-1"
                      fill="none"
                    >
                      <circle
                        stroke-width="3"
                        cx="50%"
                        cy="50%"
                        r="36"
                        className="text-paper"
                        stroke="currentColor"
                        fill="none"
                      ></circle>
                      <circle
                        stroke-width="3"
                        cx="50%"
                        cy="50%"
                        r="36"
                        stroke="rgb(242, 191, 86)"
                        strokeDasharray="226.1946710584651, 226.1946710584651"
                        strokeDashoffset={100 - game.critic_avg}
                      ></circle>
                    </svg>
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
                      {game.critic_avg}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base mt-2 text-center">Top Critic Average</p>
                </li>
              )}
              {game.critic_pct && (
                <li className=" flex flex-col items-center">
                  <div className="relative w-max">
                    <svg
                      viewBox="0 0 75 75"
                      height="75"
                      width="75"
                      version="1.1"
                      fill="none"
                      className="mb-1 -rotate-90"
                    >
                      <circle
                        stroke-width="3"
                        cx="50%"
                        cy="50%"
                        r="36"
                        strokeDasharray="51.548667764616276, 5"
                        strokeDashoffset="-2.5"
                        className="text-paper"
                        stroke="currentColor"
                        fill="none"
                      ></circle>
                      <circle
                        stroke-width="3"
                        cx="50%"
                        cy="50%"
                        r="36"
                        strokeDasharray={
                          criticRec[game.critic_rec.toLowerCase()] +
                          ", 226.1946710584651"
                        }
                        strokeDashoffset="-2.5"
                        stroke="rgb(242, 191, 86)"
                      ></circle>
                    </svg>
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
                      {game.critic_rec}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base mt-2 text-center">OpenCritic Rating</p>
                </li>
              )}
            </ul>
            <Scroll containerSelector="#review-list-scroll">
              <ul id="review-list-scroll" className="flex gap-8  overflow-x-scroll scrollbar-hidden snap-mandatory snap-x">
                {game.reviews.map((review: any) => {
                  return (
                    <Item
                      as="li"
                      className="w-4/5 sm:w-[calc(100%/2-16px)] bg-paper flex-shrink-0 rounded-md p-4 snap-center"
                    >
                      <p>{review.outlet}</p>
                      <p className="text-white_primary/60 text-sm">
                        by {review.author}
                      </p>
                      <hr className="border-white_primary/25 my-4" />
                      {review.type === "star" ? (
                        <ul className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((starIndex) => {
                            const remainder =
                              review.earned_score < starIndex
                                ? review.avg_rating % 1
                                : 0;
                            const starId = "star-rating-id-" + starIndex;
                            return (
                              <li>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="svg"
                                  viewBox="0 0 36 34"
                                  width={14}
                                  height={14}
                                  data-index={remainder}
                                  stroke="rgb(245, 245, 245)"
                                  strokeWidth={1}
                                >
                                  {remainder && (
                                    <defs>
                                      <linearGradient
                                        id={starId}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="0"
                                      >
                                        <stop
                                          stopColor="rgb(245, 245, 245)"
                                          offset={remainder.toString()}
                                        ></stop>
                                        <stop
                                          className="text-transparent"
                                          stopColor="currentColor"
                                          offset={remainder.toString()}
                                        ></stop>
                                      </linearGradient>
                                    </defs>
                                  )}
                                  <path
                                    d="M17.7835 1.05234C17.8961 0.714958 18.3733 0.714958 18.4859 1.05234L22.4334 12.8804C22.4839 13.0316 22.6253 13.1335 22.7846 13.1335H35.5375C35.8985 13.1335 36.0461 13.5975 35.7513 13.806L25.4512 21.0917C25.318 21.1859 25.2622 21.3563 25.3138 21.5112L29.2521 33.3116C29.3654 33.651 28.9792 33.9377 28.6871 33.7311L18.3485 26.4182C18.2204 26.3276 18.049 26.3276 17.9209 26.4182L7.58236 33.7311C7.29026 33.9377 6.90407 33.651 7.01734 33.3116L10.9556 21.5112C11.0073 21.3563 10.9515 21.1859 10.8182 21.0917L0.518159 13.806C0.223381 13.5975 0.370904 13.1335 0.731971 13.1335H13.4848C13.6441 13.1335 13.7856 13.0316 13.836 12.8804L17.7835 1.05234Z"
                                    fill={
                                      remainder
                                        ? `url(#${starId})`
                                        : "currentColor"
                                    }
                                  ></path>
                                </svg>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p>
                          {review.earned_score}/{review.total_score}
                        </p>
                      )}
                      <br />
                      <p className="text-sm text-white_primary/60 wrap-balance">
                        {review.body}
                      </p>
                    </Item>
                  );
                })}
              </ul>
              <ul className="flex gap-4 justify-center my-2">
                {game.reviews.map((review: any, index: number) => {
                  return (
                    <li className={"sm:even:hidden"}>
                      <ScrollBulletIndicator index={index} />
                    </li>
                  );
                })}
              </ul>
            </Scroll>
          </section>
        )}
        {game.systems.length > 0 && (
          <section className="col-start-1 col-span-full xl:[grid-column:-3/1] bg-paper px-8 py-2 pb-8 rounded-md">
            <SystemRequirements systems={game.systems} />
          </section>
        )}
      </div>
    </div>
  );
};

export default page;