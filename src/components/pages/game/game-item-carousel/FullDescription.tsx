import ExpandableDescription from '@/components/pages/game/ExpandableDescription';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import Image from 'next/image';

type FullDescriptionProps = {
  longDescription: string;
  longDescriptionImages: { ID: number; url: string; alt: string }[][];
};
export function FullDescription(props: FullDescriptionProps) {
  const { longDescription, longDescriptionImages } = props;
  return (
    <ExpandableDescription>
      <article className="text-sm text-on_surface_dim transition-colors hover:text-on_surface">
        <ReactMarkdown
          components={{ p: 'div', h1: 'h2' }}
          className="description-container"
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {longDescription}
        </ReactMarkdown>
        {longDescriptionImages.length > 0 ? (
          <div>
            {longDescriptionImages.map((row, index) => {
              return (
                <div className="mb-4 flex gap-4" key={index}>
                  {row.map((img) => {
                    return (
                      <div
                        key={img.ID}
                        className="relative aspect-video w-full overflow-hidden rounded"
                      >
                        <Image src={img.url} fill alt={img.alt || ''} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : null}
      </article>
    </ExpandableDescription>
  );
}
