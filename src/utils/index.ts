export async function getPageContent(url: any) {
  // This is a really scrappy way to do this.
  // Don't do this in production!
  const response = await fetch(url);
  const text = await response.text();
  // Particularly as it uses regexp
  //@ts-ignore
  return /<body[^>]*>([\w\W]*)<\/body>/.exec(text)[1];
}

function isBackNavigation(navigateEvent: any) {
  if (
    navigateEvent.navigationType === "push" ||
    navigateEvent.navigationType === "replace"
  ) {
    return false;
  }
  if (
    navigateEvent.destination.index !== -1 &&
    //@ts-ignore
    navigateEvent.destination.index < window.navigation.currentEntry.index
  ) {
    return true;
  }
  return false;
}

export async function onLinkNavigate(callback: Function) {
    //@ts-ignore
  window.navigation.addEventListener("navigate", (event: any) => {
    const toUrl = new URL(event.destination.url);
    if (location.origin !== toUrl.origin) return;
    const fromPath = location.pathname;
    const isBack = isBackNavigation(event);

    event.intercept({
      async handler() {
        if (event.info === "ignore") return;

        await callback({
          toPath: toUrl.pathname,
          fromPath,
          isBack,
        });
      },
    });
  });
}
