type AvgRatingProps = {
  avg_rating: number;
};
export function AvgRating(props: AvgRatingProps) {
  const { avg_rating } = props;
  return (
    <div className="flex items-center justify-center gap-4">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const remainder = avg_rating! < starIndex ? avg_rating! % 1 : 0;
        const starId = 'star-rating-id-' + starIndex;
        return (
          <svg
            key={starIndex}
            xmlns="http://www.w3.org/2000/svg"
            className="svg"
            viewBox="0 0 36 34"
            width={36}
            height={36}
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
        );
      })}
    </div>
  );
}
