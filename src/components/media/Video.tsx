'use client';

import { createContext, use, useRef, useState, useSyncExternalStore } from 'react';

type VideoEvents = (typeof Store)['events'][number][];
// type Subscribe = ReturnType<Store['subscribe']>;
// type VideoData = Store['data'];
class Store {
  public static readonly events = [
    'play',
    'pause',
    'volumechange',
    'seek',
    'timeupdate',
    'loadedmetadata',
    'seeking',
    'fullscreenchange',
  ] as const;
  videoRef: React.RefObject<HTMLVideoElement>;
  data = {
    event: undefined as undefined | VideoEvents[number],
    playing: false,
    muted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    autoPlay: false,
    video: undefined as HTMLVideoElement | undefined,
    fullscreenElement: null as Element | null,
  };
  listenerData: Map<Symbol, Store['data']> = new Map();
  listeners: Set<() => void> = new Set();

  constructor(videoRef: React.RefObject<HTMLVideoElement>) {
    this.videoRef = videoRef;
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: () => void) {
    const video = this.videoRef.current;
    if (!video) {
      return () => {};
    }
    const notify = (event: Event) => {
      const video = this.videoRef.current;
      if (!video) {
        return;
      }
      const type = event.type as VideoEvents[number];
      this.data = {
        event: type,
        playing: !video?.paused,
        muted: video?.muted,
        volume: video?.volume,
        currentTime: video?.currentTime,
        duration: video?.duration,
        autoPlay: video?.autoplay,
        video: video,
        fullscreenElement: document.fullscreenElement,
      };
      for (const listener of this.listeners) {
        listener();
      }
    };
    if (!this.listeners.size) {
      if (video.readyState >= 1) {
        notify({ type: 'loadedmetadata' } as Event);
      }
      for (const event of Store.events) {
        video.addEventListener(event, notify);
      }
      video.parentElement?.addEventListener('fullscreenchange', notify);
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      for (const event of Store.events) {
        video.removeEventListener(event, notify);
      }
    };
  }

  getData(symbol: Symbol) {
    return (options: UseVideoProps) => {
      const { events } = options;
      if (!this.data.event) {
        return this.listenerData.get(symbol) ?? this.data;
      }
      if (events.includes(this.data.event)) {
        this.listenerData.set(symbol, this.data);
      }

      return this.listenerData.get(symbol) ?? this.data;
    };
  }

  register() {
    const symbol = Symbol();
    this.listenerData.set(symbol, this.data);
    return { subscribe: this.subscribe, getData: this.getData(symbol) };
  }
}

type UseVideoProps = {
  events: VideoEvents;
};
export function useVideo(props: UseVideoProps = { events: [...Store.events] }) {
  const { store } = use(VideoCtx);
  const [reg] = useState(() => store.register());
  return useSyncExternalStore(
    reg.subscribe,
    () => reg.getData(props),
    () => store.data
  );
}

type VideoContext = {
  store: Store;
  videoRef?: React.RefObject<HTMLVideoElement>;
};
export const VideoCtx = createContext<VideoContext>({
  store: new Store({ current: null }),
  videoRef: { current: null },
});
export function VideoContainer(props: React.PropsWithChildren<Omit<VideoContext, 'store'>>) {
  const { children } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [store] = useState(new Store(videoRef));

  return <VideoCtx.Provider value={{ store, videoRef }}>{children}</VideoCtx.Provider>;
}
