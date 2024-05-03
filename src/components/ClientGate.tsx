import { PropsWithChildren, useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}
export function ClientGate(props: PropsWithChildren) {
  const { children } = props;

  const isServer = useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  );

  return isServer ? null : children;
}
