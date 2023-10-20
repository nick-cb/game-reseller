self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", (event) => {
  event.waitUntil(
    (async () => {
      if (!event.clientId) return;

      const client = await self.clients.get(event.clientId);
      if (!client) {
        return;
      }
      // if (event.request.body) {
      //   if ("getReader" in event.request.body) {
      //     console.log(event.request.url, event.request.body.getReader());
      //   } else {
      //     console.log(event.request.url, "no body reader");
      //   }
      // } else {
      //   console.log(event.request.url, "no body");
      // }
      console.log(event.request);
      client.postMessage({
        msg: event.request.url,
      });
    })(),
  );
});
