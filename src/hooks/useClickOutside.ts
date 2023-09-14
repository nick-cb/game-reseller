import React, { useState, useEffect, useRef } from "react";

export const useClickOutside = (
  ref: React.RefObject<any>,
  initial = false
): [boolean, Function, React.MutableRefObject<any>] => {
  const [visible, setVisible] = useState<boolean>(initial);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) setVisible(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  return [visible, setVisible, ref];
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
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return ref;
};
