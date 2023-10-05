"use client";

import { useContext, useDeferredValue, useState } from "react";
import { SnackContext } from "./SnackContext";
import StandardButton from "./StandardButton";

export function Test() {
  const { showMessage } = useContext(SnackContext);
  const [state, setState] = useState({ index: 0 });
  const deferredState = useDeferredValue(state);
  console.log(state, deferredState);

  return (
    <StandardButton
      onClick={() => {
        setState({ index: Math.random() });
        // showMessage({
        //   message: "New message",
        //   type: 'success',
        //   timeout: 10000
        // });
      }}
    >
      Click
    </StandardButton>
  );
}

export function TestClientButton<T>({
  onClick,
}: {
  onClick: () => Promise<T>;
}) {
  return (
    <button onClick={async () => await onClick()}>Test server action</button>
  );
}
