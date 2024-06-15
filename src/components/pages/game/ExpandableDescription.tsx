import { mergeCls } from '@/utils';
import { PropsWithChildren } from 'react';

type ExpandableDescriptionProps = {
  className?: string;
};
export default function ExpandableDescription(
  props: PropsWithChildren<ExpandableDescriptionProps>
) {
  const { children, className = '' } = props;
  return (
    <div
      className={mergeCls(
        `relative max-h-[40rem] overflow-hidden pb-12 has-[input[name='expandable-description']:checked]:max-h-max has-[input[name='expandable-description']:checked]:overflow-auto`,
        'group',
        className
      )}
    >
      {children}
      <div className={'absolute bottom-0 w-full'}>
        <div
          id="expandable-description-gradient-bg"
          className="h-40 w-full bg-gradient-to-t from-default group-has-[input[name='expandable-description']:checked]:hidden"
        ></div>
        <div className="bg-default">
          <label
            className={mergeCls(
              'group relative flex h-12 items-center justify-center rounded bg-paper',
              'after:absolute after:inset-0 after:rounded after:bg-white/25 after:opacity-0 after:transition-opacity hover:after:opacity-100',
              'has-[:focus]:after:opacity-100',
            )}
          >
            <input type="checkbox" name="expandable-description" className="hidden" />
            <span className="hidden group-has-[input[name='expandable-description']:not(:checked)]:block">
              Show more
            </span>
            <span className="hidden group-has-[input[name='expandable-description']:checked]:block">
              Show less
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
