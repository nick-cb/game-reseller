import { Text } from '@/components/Typography';
import { mergeCls } from '@/utils';
import Image from 'next/image';

type PollProps = {
  polls: Polls[];
};
export function Polls(props: PollProps) {
  const { polls } = props;
  return (
    <>
      {polls.slice(0, 6).map((poll) => {
        return (
          <div
            key={poll.ID}
            className={mergeCls(
              'rounded-md bg-paper',
              'flex items-center xl:flex-col xl:justify-center',
              'gap-4 p-4 xl:aspect-[4/3] xl:gap-0 xl:p-0'
            )}
          >
            {poll.result_emoji ? (
              <Image
                src={poll.result_emoji}
                width={42}
                height={42}
                alt={poll.result_title}
                className="xl:mb-4"
              />
            ) : null}
            <div className="flex-col items-center justify-center xl:flex">
              <Text dim className="mb-1 xl:mb-2">
                {poll.result_text}
              </Text>
              <Text size="base" className="text-bold">
                {poll.result_title}
              </Text>
            </div>
          </div>
        );
      })}
    </>
  );
}
