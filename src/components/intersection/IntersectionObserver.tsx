'use client';

import React, {
  createContext,
  isValidElement,
  use,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

class Store {
  private containerRef: React.RefObject<HTMLElement>;
  private options: Exclude<IntersectionObserverInit, 'root'>;
  private _listeners: Set<() => void> = new Set();
  private event: IntersectionObserverEvent | undefined;
  data = {
    observer: null as IntersectionObserver | null,
    entries: [] as IntersectionObserverEntry[],
    firstVisibleIndex: -1,
    lastVisibleIndex: -1,
  };

  constructor(
    containerRef: React.RefObject<HTMLElement>,
    options?: Exclude<IntersectionObserverInit, 'root'>
  ) {
    this.containerRef = containerRef;
    this.options = options || {
      threshold: [0.5],
    };
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: () => void) {
    this._listeners.add(listener);
    if (!this.data.observer) {
      this.data = {
        entries: [],
        firstVisibleIndex: -1,
        lastVisibleIndex: -1,
        observer: new IntersectionObserver(
          (entries) => {
            this.event = 'change';
            let firstVisibleIndex = -1;
            let lastVisibleIndex = -1;
            const oldEntries = this.data.entries;
            for (let i = 0; i < entries.length; i++) {
              const newEntry = entries[i];
              const oldEntryIdx = oldEntries.findIndex((e) => e.target.isSameNode(newEntry.target));
              if (oldEntryIdx !== -1) {
                oldEntries[oldEntryIdx] = newEntry;
              } else {
                oldEntries.push(newEntry);
              }
            }
            for (let i = 0; i < oldEntries.length; i++) {
              const entry = oldEntries[i];
              if (firstVisibleIndex === -1 && entry.isIntersecting) {
                firstVisibleIndex = i;
              }
              if (entry.isIntersecting) {
                lastVisibleIndex = i;
              }
            }
            this.data = {
              observer: this.data.observer,
              entries: [...oldEntries],
              firstVisibleIndex: firstVisibleIndex,
              lastVisibleIndex: lastVisibleIndex,
            };
            for (const listener of this._listeners) {
              listener?.();
            }
            this.event = undefined;
          },
          { ...this.options, root: this.containerRef.current }
        ),
      };
    }
    return () => {
      this._listeners.delete(listener);
    };
  }

  getDataWithEvent(event: IntersectionObserverEvent, callback: (data: typeof this.data) => void) {
    if (event === this.event) {
      callback(this.data);
    }
  }

  updateContainerRef(containerRef: React.RefObject<HTMLElement>) {
    this.containerRef = containerRef;
  }
}

export function useIntersectionObserver() {
  const { store } = use(IntersectionObserverCtx);

  const result = useSyncExternalStore(
    store.subscribe,
    () => store.data,
    () => store.data
  );

  return result;
}

type IntersectionObserverEvent = 'change';
export function useIntersectionEvent(
  event: IntersectionObserverEvent,
  callback: (data: Store['data']) => void
) {
  const { store } = use(IntersectionObserverCtx);
  useSyncExternalStore(
    store.subscribe,
    () => store.getDataWithEvent(event, callback),
    () => store.data
  );
}

type IntersectionObserverCtxProps = {
  containerRef: React.RefObject<HTMLElement>;
  store: Store;
};
export const IntersectionObserverCtx = createContext<IntersectionObserverCtxProps>({
  containerRef: { current: null },
  store: null as unknown as Store,
});
type IntersectionObserverContainerProps = {
  options?: Exclude<IntersectionObserverInit, 'root'>;
};
export function IntersectionObserverContainer(
  props: React.PropsWithChildren<IntersectionObserverContainerProps>
) {
  const ref = useRef<HTMLElement>(null);
  const { children, options } = props;
  const [store] = useState(new Store(ref, options));

  return (
    <IntersectionObserverCtx.Provider value={{ containerRef: ref, store }}>
      {children}
    </IntersectionObserverCtx.Provider>
  );
}

export function IntersectionObserverRoot(props: React.PropsWithChildren) {
  const { containerRef, store } = use(IntersectionObserverCtx);
  const { children, ...rest } = props;

  if (isValidElement(children)) {
    if ('ref' in children.props) {
      if (children.props.ref) {
        store.updateContainerRef(children.props.ref as React.RefObject<HTMLElement>);
      }
      const ref = (children.props.ref as React.RefObject<HTMLElement>) || containerRef;
      return React.cloneElement(children, { ...children.props, ...rest, ref: ref });
    }
    return React.cloneElement(children, { ...children.props, ...rest, ref: containerRef });
  }

  return children;
}
