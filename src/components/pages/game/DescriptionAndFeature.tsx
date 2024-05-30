type DescriptionAndFeatureProps = {
  description: string;
  tags: Tags[];
};
export function DescriptionAndFeature(props: DescriptionAndFeatureProps) {
  const { description, tags } = props;
  return (
    <>
      <summary className="list-none text-sm text-white_primary sm:text-base">{description}</summary>
      <div className="flex justify-between gap-8">
        <div className="mt-4 w-full border-l border-white/60 py-3 pl-4">
          <p className="text-sm text-white/60">Genres</p>
          <p className="text-sm text-white">
            {tags
              .filter((tag) => tag.group_name === 'genre')
              .map((tag: any) => tag.name[0].toUpperCase() + tag.name.substring(1))
              .join(', ')}
          </p>
        </div>
        <div className="mt-4 w-full border-l border-white/60 py-3 pl-4">
          <p className="text-sm text-white/60">Features</p>
          <p className="text-sm text-white">
            {tags
              .filter((tag) => tag.group_name === 'feature')
              .map((tag: any) => tag.name[0].toUpperCase() + tag.name.substring(1))
              .join(', ')}
          </p>
        </div>
      </div>
    </>
  );
}
