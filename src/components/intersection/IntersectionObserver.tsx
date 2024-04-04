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
  private _listeners: Set<() => void> = new Set();
  data = {
    observer: null as IntersectionObserver | null,
    entries: [] as IntersectionObserverEntry[],
    firstVisibleIndex: -1,
    lastVisibleIndex: -1,
  };

  constructor(containerRef: React.RefObject<HTMLElement>) {
    this.containerRef = containerRef;
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
          },
          {
            root: this.containerRef.current,
            threshold: [0.5],
          }
        ),
      };
    }
    return () => {
      this._listeners.delete(listener);
      // this._data.observer?.disconnect();
    };
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

type IntersectionObserverCtxProps = {
  containerRef: React.RefObject<HTMLElement>;
  store: Store;
};
export const IntersectionObserverCtx = createContext<IntersectionObserverCtxProps>({
  containerRef: { current: null },
  store: new Store({ current: null }),
});
export function IntersectionObserverContainer(props: React.PropsWithChildren) {
  const ref = useRef<HTMLElement>(null);
  const { children } = props;
  const [store] = useState(new Store(ref));

  return (
    <IntersectionObserverCtx.Provider value={{ containerRef: ref, store }}>
      {children}
    </IntersectionObserverCtx.Provider>
  );
}

export function IntersectionObserverRoot(props: React.PropsWithChildren) {
  const { containerRef } = use(IntersectionObserverCtx);
  const { children, ...rest } = props;

  if (isValidElement(children)) {
    return React.cloneElement(children, { ...children.props, ...rest, ref: containerRef });
  }

  return children;
}
