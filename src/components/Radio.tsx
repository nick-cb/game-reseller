"use client";

import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { CheckMarkSvg } from "@/components/pages/payment/PaymentRadioTab";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

const RadioGroupContext = createContext<{
  selected: string | null;
  changeSelected: (newSelected: string) => void;
}>({ selected: null, changeSelected: () => {} });

export function RadioGroup({
  toggleAble,
  children,
}: PropsWithChildren<{ toggleAble: boolean }>) {
  const [selected, setSelected] = useState<string | null>(null);
  const changeSelected = (newSelected: string | null) => {
    setSelected(() => {
      console.log(newSelected);
      if (toggleAble && selected === newSelected) {
        return null;
      }
      return newSelected;
    });
  };

  return (
    <RadioGroupContext.Provider
      value={{
        selected,
        changeSelected,
      }}
    >
      {children}
    </RadioGroupContext.Provider>
  );
}

export function useRadio() {
  const value = useContext(RadioGroupContext);

  return value;
}

export function RadioInput({
  className = "",
  LabelComponent,
  IconComponent = <CheckMarkSvg />,
  ...props
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  LabelComponent?: React.ReactElement;
  IconComponent?: React.ReactElement;
}) {
  return (
    <div className="flex items-center">
      <div className="relative after:absolute after:inset-0 after:bg-default after:rounded-full">
        <input
          type="radio"
          className={
            "block relative peer " +
            " after:absolute after:rounded-full after:inset-0 " +
            " after:bg-white_primary/25 checked:after:bg-primary " +
            " before:absolute before:-left-1 before:-top-1 before:h-[calc(100%+8px)] before:w-[calc(100%+8px)] hover:before:bg-white/30 " +
            " before:rounded-full before:transition-colors " +
            " after:z-[1] before:z-[1] " +
            className
          }
          {...props}
        />
        {IconComponent}
      </div>
      {LabelComponent}
    </div>
  );
}

export function Radio({
  id,
  onClick,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof RadioInput>, "id"> & { id: string }) {
  const { selected, changeSelected } = useRadio();

  return (
    <RadioInput
      id={id}
      checked={selected === id}
      aria-checked={selected === id}
      onClick={(event) => {
        changeSelected(event.currentTarget.id);
        onClick?.(event);
      }}
      onChange={onChange || (() => {})}
      {...props}
    />
  );
}

export function HookFormRadio({
  id,
  name,
  IconComponent = <CheckMarkSvg />,
  LabelComponent,
  className = "",
  registerOptions,
  ...props
}: Omit<React.ComponentProps<typeof RadioInput>, "name"> & {
  name: string;
  registerOptions?: RegisterOptions<FieldValues, string> | undefined;
}) {
  const { register } = useFormContext();

  return (
    <div className="flex items-center">
      <div className="relative after:absolute after:inset-0 after:bg-default after:rounded-full">
        <input
          id={id}
          type="radio"
          className={
            "block relative peer " +
            " after:absolute after:rounded-full after:inset-0 " +
            " after:bg-white_primary/25 checked:after:bg-primary " +
            " before:absolute before:-left-1 before:-top-1 before:h-[calc(100%+8px)] before:w-[calc(100%+8px)] hover:before:bg-white/30 " +
            " before:rounded-full before:transition-colors " +
            " after:z-[1] before:z-[1] " +
            className
          }
          {...props}
          {...register(name, registerOptions)}
        />
        {IconComponent}
      </div>
      {LabelComponent}
    </div>
  );
}
