"use client";

import { useLottie } from "lottie-react";
import React, { useCallback, useState } from "react";
import lottieuser from "../../../public/user-lottie.json";
import "./dialog.css";
import Link from "next/link";
import Image from "next/image";
import { Users } from "@/database/models";
import { useClickOutsideCallback } from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/users";

export function LottieUserButton() {
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
          },
        }}
        onMouseEnter={handler}
        className="relative h-full flex items-center gap-2 px-4 rounded overflow-hidden 
        after:absolute after:inset-0 after:bg-white/[.15] after:opacity-0
        hover:after:opacity-100 after:transition-opacity after:rounded"
        prefetch={true}
      >
        {View} Login
      </Link>
    </>
  );
}

export function AuthUserButton({ user }: { user: Users }) {
  const router = useRouter();
  const [focus, setFocus] = useState(false);
  const ref = useClickOutsideCallback<HTMLDivElement>(() => {
    setFocus(false);
  });

  return (
    <div
      ref={ref}
      onClick={() => {
        setFocus(true);
      }}
      className="relative"
    >
      <button
        type="button"
        className="relative w-8 h-8 rounded-full bg-white/25 transition-all hover:scale-110 group"
      >
        <Image src={user.avatar} alt="" fill className="rounded-full" />
      </button>
      <div
        className={
          "absolute right-0 rounded shadow-white/10 shadow-md transition-[height] duration-400 overflow-hidden " +
          (focus ? "h-10 bg-paper_2" : "h-0")
        }
      >
        <button
          onClick={async () => {
            try {
              await logout();
              location.reload();
            } catch (error) {
              console.log(error);
            }
          }}
          className="hover:brightness-105 h-10 w-28 rounded transition-colors duration-75 hover:bg-paper"
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
