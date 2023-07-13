"use client";

import { useContext } from "react";
import { SnackContext } from "./SnackContext";
import StandardButton from "./StandardButton";

export function Test() {
  const { showMessage } = useContext(SnackContext);
  return (
    <StandardButton
      onClick={() => {
        showMessage({
          message: "New message",
          type: 'success',
          timeout: 10000
        });
      }}
    >
      Click
    </StandardButton>
  );
}
