import { ScrollContainer, ScrollItem } from '@/components/scroll/ScrollPrimitive';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '../../intersection/IntersectionObserver';
import { ScrollBulletIndicator } from '@/components/scroll/Indicators';
import { Text } from '@/components/Typography';

const criticRec = {
  weak: '51.548667764616276',
  fair: '51.548667764616276, 5, 51.548667764616276',
  strong: '51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276',
  mighty: '51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276, 5, 51.548667764616276',
};
type CriticRatingProps = {
  game: Pick<Game, 'name' | 'critic_pct' | 'critic_avg' | 'critic_rec'> & {
    reviews: Reviews[];
  };
};
export function CriticRating({ game }: CriticRatingProps) {
  return (
    <>
      <Text as="h2" className="pb-4 text-xl">
        {game.name} Ratings & Reviews
      </Text>
      <ul className="flex gap-4">
        {game.critic_pct && (
          <li className=" flex flex-col items-center">
            <div className="relative w-max">
              <RatingCircle rating={game.critic_pct} />
              <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {game.critic_pct + '%'}
              </Text>
            </div>
            <Text size="base" className="mt-2 text-center">
              Critics Recommend
            </Text>
          </li>
        )}
        {game.critic_avg && (
          <li className=" flex flex-col items-center">
            <div className="relative w-max">
              <RatingCircle rating={game.critic_avg} />
              <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {game.critic_avg}
              </Text>
            </div>
            <Text size="base" className="mt-2 text-center">
              Top Critic Average
            </Text>
          </li>
        )}
        {game.critic_rec && (
          <li className=" flex flex-col items-center">
            <div className="relative w-max">
              <TieredRatingCircle rating={game.critic_rec.toLowerCase() as CriticAvg} />
              <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {game.critic_rec}
              </Text>
            </div>
            <Text size="base" className="mt-2 text-center">
              OpenCritic Rating
            </Text>
          </li>
        )}
      </ul>
      <br />
      <IntersectionObserverContainer>
        <IntersectionObserverRoot>
          <ScrollContainer className="scrollbar-hidden flex snap-x snap-mandatory gap-8 overflow-x-scroll">
            {game.reviews.map((review, index) => {
              return (
                <ScrollItem
                  key={review.ID}
                  index={index}
                  className="w-4/5 flex-shrink-0 snap-start rounded-md bg-paper p-4 sm:w-[calc(100%/2-16px)] sm:odd:snap-start"
                >
                  <Text size="base">{review.outlet}</Text>
                  <Text dim>by {review.author}</Text>
                  <hr className="my-4 border-white_primary/25" />
                  {review.type === 'star' ? (
                    <StarRating
                      earned_score={review.earned_score!}
                      avg_rating={review.avg_rating}
                    />
                  ) : (
                    <Text>
                      {Math.round(review.earned_score! * 100) / 100}/{review.total_score}
                    </Text>
                  )}
                  <br />
                  <Text dim className="wrap-balance">
                    {review.body}
                  </Text>
                </ScrollItem>
              );
            })}
          </ScrollContainer>
        </IntersectionObserverRoot>
        <ul className="my-2 flex justify-center gap-4">
          {game.reviews.map((review, index) => {
            return (
              <li key={review.ID} className="sm:even:hidden">
                <ScrollBulletIndicator index={index} />
              </li>
            );
          })}
        </ul>
      </IntersectionObserverContainer>
    </>
  );
}

function TieredRatingCircle({ rating }: { rating: keyof typeof criticRec }) {
  return (
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
        strokeDasharray={criticRec[rating] + ', 226.1946710584651'}
        strokeDashoffset="-2.5"
        stroke="rgb(242, 191, 86)"
      ></circle>
    </svg>
  );
}

function RatingCircle({ rating }: { rating: number }) {
  return (
    <svg
      viewBox="0 0 75 75"
      height="75"
      width="75"
      version="1.1"
      className="mb-1 -rotate-90"
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
        strokeDashoffset={100 - rating}
      ></circle>
    </svg>
  );
}

function StarRating({ earned_score, avg_rating }: { earned_score: number; avg_rating: number }) {
  return (
    <ul className="flex gap-2">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const remainder = earned_score < starIndex ? avg_rating % 1 : 0;
        const starId = 'star-rating-id-' + starIndex;
        return (
          <li key={starIndex}>
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
                  <linearGradient id={starId} x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="rgb(245, 245, 245)" offset={remainder.toString()}></stop>
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
                fill={remainder ? `url(#${starId})` : 'currentColor'}
              ></path>
            </svg>
          </li>
        );
      })}
    </ul>
  );
}
