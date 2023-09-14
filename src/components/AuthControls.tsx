"use client";

import { LottieUserButton } from "./lottie-user-button/LottieUserBtn";
import Image from "next/image";
import { useEffect, useState } from "react";

export function AuthControls() {
  let storedUser = null;
  try {
    storedUser =
      typeof window !== "undefined"
        ? // @ts-ignore
          JSON.parse(localStorage.getItem("user"))
        : null;
  } catch (error) {}

  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.addEventListener("storage", () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setUser(user);
    });
  }, []);

  return (
    <>
      {user ? (
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-paper">
          <Image src={user.avatar} alt="" fill />
        </div>
      ) : (
        <LottieUserButton />
      )}
    </>
  );
}
