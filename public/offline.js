/**
 * @param {string[]} resources
 * */
// const addResourceToCache = async (resources) => {
//   const cache = await caches.open("v1");
//   await cache.addAll(resources);
// };

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     addResourceToCache([
//       "localhost",
//       "https%3A%2F%2Fcdn1.epicgames.com%2Foffer%2Fc4c7d3cd0a2f4ea2bf7d4a57e46e8d68%2FEGS_NekoGhostJump_BurgosGames_S2_1200x1600-b754b5c67827936697227849596d4829%3Fh%3D480%26resize%3D1%26w%3D360&w=3840&q=75",
//     ])
//   );
// });

// const putInCache = async (request, response) => {
//   const cache = await caches.open("v1");
//   await cache.put(request, response);
// };

// const cacheFirst = async (request) => {
//   const responseFromCache = await caches.match(request);
//   if (responseFromCache) {
//     return responseFromCache;
//   }
//   const responseFromNetwork = await fetch(request);
//   putInCache(request, responseFromNetwork.clone());
//   return responseFromNetwork;
// };

// self.addEventListener("fetch", (event) => {
//   event.respondWith(cacheFirst(event.request));
// });

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/html" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "localhost",
    })
  );
});
