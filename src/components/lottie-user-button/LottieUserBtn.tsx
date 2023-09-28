"use client";

import { useLottie } from "lottie-react";
import React, { useCallback } from "react";
import lottieuser from "../../../public/user-lottie.json";
import "./dialog.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LottieUserButton() {
  const router = useRouter();
  const { View, goToAndPlay } = useLottie({
    animationData: lottieuser,
    autoplay: false,
    loop: false,
    style: { width: "20px", height: "20px" },
  });

  const handler = useCallback(() => {
    goToAndPlay(0);
  }, [goToAndPlay]);

  return (
    <>
      <Link
        href={{
          pathname: "/login",
          query: {
            type: "modal",
          }
        }}
        onMouseEnter={handler}
        className="relative flex items-center gap-2 px-4 rounded overflow-hidden 
        after:absolute after:inset-0 after:bg-white/[.15] after:opacity-0
        hover:after:opacity-100 after:transition-opacity after:rounded"
        prefetch={true}
      >
        {View} Login
      </Link>
    </>
  );
}
