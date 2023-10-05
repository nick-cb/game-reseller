"use client";

import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
  createContext,
  startTransition,
  useContext,
  useState,
} from "react";
import { FilterContext } from "./FilterContext";
import { Collections } from "@/database/models";
import { usePathname, useRouter } from "next/navigation";

const RadioContext = createContext<{
  selected: string | null;
  changeSelected: (newSelected: string) => void;
}>({
  selected: null,
  changeSelected: () => {},
});
export function RadioGroup({
  toggleAble = false,
  children,
}: PropsWithChildren<{ toggleAble?: boolean }>) {
  const { collection: collectionKey } = useContext(FilterContext);
  const [selected, setSelected] = useState<string | null>(collectionKey);
  const changeSelected = (newSelected: string) => {
    if (toggleAble) {
      if (newSelected === selected) {
        setSelected(null);
        return;
      }
    }
    setSelected(newSelected);
  };

  return (
    <RadioContext.Provider
      value={{
        selected,
        changeSelected,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function CollectionRadio({
  collection,
  ...props
}: { collection: Collections } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const router = useRouter();
  const pathname = usePathname();
  const { searchParams } = useContext(FilterContext);
  const { selected, changeSelected } = useContext(RadioContext);

  return (
    <input
      type="radio"
      id={collection.collection_key}
      value={collection.collection_key}
      aria-checked={selected === collection.collection_key}
      checked={selected === collection.collection_key}
      onClick={() => {
        changeSelected(collection.collection_key);

        if (selected === collection.collection_key) {
          searchParams?.delete("collection");
        } else {
          searchParams?.set("collection", collection.collection_key);
        }
        router.push(`${pathname}${searchParams ? "?" + searchParams : ""}`);
      }}
      {...props}
    />
  );
}
