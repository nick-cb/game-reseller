import Reviews, { CriticAvg, Game } from "@/database/models";
import { ScrollBulletIndicator } from "../home/hero-slider";
import { Scroll, ScrollItem } from "../scroll";
import { OmitGameId } from "@/actions/game/select";

const criticRec = {
  weak: "51.548667764616276",
  fair: "51.548667764616276, 5, 51.548667764616276",
  strong: "51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276",
  mighty:
    "51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276",
};
export function CriticRating({
  game,
}: {
  game: Pick<Game, "name" | "critic_pct" | "critic_avg" | "critic_rec"> & {
    reviews: OmitGameId<Reviews>[];
  };
}) {
  return (
    <>
      <h2 className="text-xl text-white_primary pb-4">
        {game.name} Ratings & Reviews
      </h2>
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
            <p className="text-sm sm:text-base mt-2 text-center">
              Critics Recommend
            </p>
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
                  strokeDashoffset={100 - game.critic_avg}
                ></circle>
              </svg>
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
                {game.critic_avg}
              </p>
            </div>
            <p className="text-sm sm:text-base mt-2 text-center">
              Top Critic Average
            </p>
          </li>
        )}
        {game.critic_rec && (
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
                  strokeWidth="3"
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
                  strokeWidth="3"
                  cx="50%"
                  cy="50%"
                  r="36"
                  strokeDasharray={
                    criticRec[game.critic_rec.toLowerCase() as CriticAvg] +
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
            <p className="text-sm sm:text-base mt-2 text-center">
              OpenCritic Rating
            </p>
          </li>
        )}
      </ul>
      <Scroll containerSelector="#review-list-scroll">
        <ul
          id="review-list-scroll"
          className="flex gap-8  overflow-x-scroll scrollbar-hidden snap-mandatory snap-x"
        >
          {game.reviews.map((review) => {
            return (
              <ScrollItem
                key={review.ID}
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
                        review.earned_score! < starIndex
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
                                remainder ? `url(#${starId})` : "currentColor"
                              }
                            ></path>
                          </svg>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>
                    {Math.round(review.earned_score! * 100) / 100}/
                    {review.total_score}
                  </p>
                )}
                <br />
                <p className="text-sm text-white_primary/60 wrap-balance">
                  {review.body}
                </p>
              </ScrollItem>
            );
          })}
        </ul>
        <ul className="flex gap-4 justify-center my-2">
          {game.reviews.map((review, index) => {
            return (
              <li key={review.ID} className={"sm:even:hidden"}>
                <ScrollBulletIndicator index={index} />
              </li>
            );
          })}
        </ul>
      </Scroll>
    </>
  );
}
