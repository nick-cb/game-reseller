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
  private _listeners: Set<() => void> = new Set();
  private _data = {
    observer: null as IntersectionObserver | null,
    entries: [] as IntersectionObserverEntry[],
  };
  get data() {
    return this._data;
  }

  constructor(containerRef: React.RefObject<HTMLElement>) {
    if (typeof window === 'undefined') {
      return;
    }
    this._data.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = this._data.entries.findIndex((en) => en?.target.isSameNode(entry.target));
          if (index > -1) {
            this._data.entries[index] = entry;
          } else {
            this._data.entries.push(entry);
          }
        }
        this._data = {
          ...this._data,
        };
        for (const listener of this._listeners) {
          listener?.();
        }
      },
      {
        root: containerRef.current,
        threshold: [0.5, 1],
      }
    );

    this._data = {
      ...this._data,
    };
  }

  subscribe(listener: () => void) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }
}

export function useIntersectionObserver() {
  const { store } = use(IntersectionObserverCtx);

  return useSyncExternalStore(
    (callback) => {
      const unsub = store.subscribe(callback);

      return () => {
        unsub();
      };
    },
    () => store.data,
    () => store.data
  );
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

