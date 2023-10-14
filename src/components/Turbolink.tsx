"use client";

import { useEffect } from "react";

export function TurboLink() {
  useEffect(() => {
    // let registration: ServiceWorkerRegistration;
    // (async () => {
    //   registration = await navigator.serviceWorker.register("/turborlink.js", {
    //     scope: "/",
    //   });
    //   navigator.serviceWorker.addEventListener("message", (event) => {

    //   });
    // })();

    // return () => {
    //   registration?.unregister();
    // };
  }, []);

  return <div className="w-full h-1 bg-primary"></div>;
}
