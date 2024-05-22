import React, { useEffect, useRef, useSyncExternalStore, useCallback } from 'react';

export const useClickOutside = (ref: React.RefObject<any>) => {
  const isClickOutside = useRef(true);
  return useSyncExternalStore(
    useCallback((listener) => {
      const handler = (event: MouseEvent) => {
        isClickOutside.current = ref.current && !ref.current.contains(event.target);
        listener();
      };
      document.addEventListener('click', handler, true);
      return () => {
        document.removeEventListener('click', handler, true);
      };
    }, []),
    () => isClickOutside.current,
    () => isClickOutside.current
  );
};

export const useClickOutsideCallback = <T extends HTMLElement>(
  callback: (ref: React.RefObject<T>) => void
) => {
  const ref = useRef<T>(null);
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback(ref);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return ref;
};
