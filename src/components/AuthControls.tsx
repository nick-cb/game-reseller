"use client";

import { LottieUserButton } from "./lottie-user-button/LottieUserBtn";
import Image from "next/image";

export function AuthControls() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

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
