import { Text } from '@/components/Typography';

type DescriptionAndFeatureProps = {
  description: string;
  tags: Tags[];
};
export function DescriptionAndFeature(props: DescriptionAndFeatureProps) {
  const { description, tags } = props;
  return (
    <>
      <Text size="base">{description}</Text>
      <div className="flex justify-between gap-8">
        <div className="mt-4 w-full border-l border-white/60 py-3 pl-4">
          <Text dim className="mb-2">
            Genres
          </Text>
          <Text className="line-clamp-3">
            {tags
              .filter((tag) => tag.group_name === 'genre')
              .map((tag: any) => tag.name[0].toUpperCase() + tag.name.substring(1))
              .join(', ')}
          </Text>
        </div>
        <div className="mt-4 w-full border-l border-white/60 py-3 pl-4">
          <Text dim className="mb-2">
            Features
          </Text>
          <Text className="line-clamp-3">
            {tags
              .filter((tag) => tag.group_name === 'feature')
              .map((tag: any) => tag.name[0].toUpperCase() + tag.name.substring(1))
              .join(', ')}
          </Text>
        </div>
      </div>
    </>
  );
}
