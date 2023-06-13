"use client";

import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";

const OfflineBanner = () => {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine);

  const handleOffline = () => {
    setIsOffline(true);
  };
  const handleOnline = () => {
    setIsOffline(false);
    startTransition(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      removeEventListener("online", handleOnline);
      removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }
  return (
    <div>
      You are currently offline, cache data will be shown for now
      <button
        onClick={() => {
          router.refresh();
        }}
      >
        Retry
      </button>
    </div>
  );
};

export default OfflineBanner;
