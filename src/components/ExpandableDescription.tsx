'use client';

import { mergeCls } from '@/utils';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function ExpandableDescription({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    let childrenHeight = 0;
    for (const child of container.children) {
      childrenHeight += child.clientHeight;
    }
    if (!show && childrenHeight > container.clientHeight) {
      setShow(true);
    }
  });

  const Gradient = <div className="h-40 w-full bg-gradient-to-t from-default"></div>;

  return (
    <div
      className={mergeCls('relative', className, !expanded ? 'h-144 overflow-hidden' : 'h-max')}
      ref={ref}
    >
      {children}
      {show ? (
        <div className={(!expanded ? 'absolute bottom-0 ' : '') + ' w-full'}>
          {!expanded ? Gradient : null}
          <div className="bg-default">
            <button
              className={
                'relative w-full rounded bg-paper py-4 text-sm ' +
                'after:absolute after:inset-0 after:rounded after:bg-white/25 after:opacity-0 after:transition-opacity hover:after:opacity-100 '
              }
              onClick={() => {
                setExpanded((prev) => !prev);
              }}
            >
              {!expanded ? 'Show more' : 'Show less'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
