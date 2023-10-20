"use client";

import { testServerAction } from "@/actions/test";
import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from "react";

export function ClientForm({
  children,
  ...props
}: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) {
  return (
    <form
      onSubmit={async (e) => {
        // e.preventDefault();
        console.log("form start submit");
        // await testServerAction();
        console.log("form submitted");
        return false;
      }}
      {...props}
    >
      {children}
    </form>
  );
}

export function ClientButton({ children }: PropsWithChildren) {
  return (
    <button
      onClick={() => {
        console.log("clicked");
      }}
    >
      {children}
    </button>
  );
}
