'use client';

import { Mutable } from '@/utils';
import React, {
  createContext,
  useCallback,
  useRef,
  useSyncExternalStore,
  use,
  useState,
} from 'react';

type StoreOptions = {
  events: (typeof Store)['events'][number] | Mutable<(typeof Store)['events'][number]>;
};
class Store {
  public static readonly events = [
    'play',
    'pause',
    'volumechange',
    'seek',
    'timeupdate',
    'loadedmetadata',
    'seeking',
  ] as const;
  private videoRef: React.RefObject<HTMLVideoElement> = { current: null };
  private options: StoreOptions = { events: Store.events as any };
  private _listeners: Set<() => void> = new Set();
  private _data = {
    playing: false,
    muted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    video: undefined as HTMLVideoElement | undefined,
    fullscreenElement: null as Element | null,
  };
  get data() {
    return this._data;
  }
  private callbacks: Map<
    (listener: () => void) => void,
    { [key in (typeof Store)['events'][number]]?: Store['data'] }[]
  > = new Map();

  constructor(videoRef: React.RefObject<HTMLVideoElement>) {
    if (typeof window === 'undefined') {
      return;
    }
    this.videoRef = videoRef;
    this.notify = this.notify.bind(this);
  }

  notify(event: Event) {
    const video = event.currentTarget as HTMLVideoElement;
    console.log(event.type, this._listeners?.size, video);
    if (!video) {
      return;
    }
    // this.updateStore(video);
    const data = {
      playing: !video.paused,
      muted: video.muted,
      volume: video.volume,
      currentTime: video.currentTime,
      duration: video.duration,
      video: video,
      fullscreenElement: document.fullscreenElement,
    };
    for (const callback of this.callbacks.keys()) {
      this.callbacks.get(callback)?.push({ [event.type]: data });
      // callback();
    }
  }

  updateStore(video: HTMLVideoElement) {
    this._data = {
      playing: !video.paused,
      muted: video.muted,
      volume: video.volume,
      currentTime: video.currentTime,
      duration: video.duration,
      video: video,
      fullscreenElement: document.fullscreenElement,
    };
  }

  register(callback: (listener: () => void) => void) {
    if (!this.callbacks.has(callback)) {
      this.callbacks.set(callback, []);
    }
  }

  getData(callback: (listener: () => void) => void, options: StoreOptions) {
    const { events } = options;
    const items = this.callbacks.get(callback);

    console.log({ items: [...(items ?? [])] });
    let item = items?.pop();
    if (!item) {
      return this._data;
    }
    const [key, values] = Object.entries(item)[0];
    do {
      item = items?.pop();
    } while (!events.includes(key as any) || !items?.length);
    return values;
  }

  subscribe() {
    const video = this.videoRef.current;
    const { events } = this.options ?? { events: Store.events };
    if (!video) {
      return () => {};
    }
    const callbacks = this.callbacks;
    const sub = (listener: any) => {
      return () => {

      }
    }

    const notifier = this.notify(sub);
    for (const event of events) {
      video.addEventListener(event, this.notify);
    }
  }
}

const defaultProps = {
  events: Store.events as Mutable<(typeof Store)['events']>,
};
export type UseVideoProps = {
  events: StoreOptions['events'];
};
export function useVideo(props: UseVideoProps = defaultProps, log = false) {
  const { store } = use(VideoCtx);
  // if (log) {
  //   console.log({ store });
  // }
  // const subscribe = useCallback(
  //   (callback: () => void) => {
  //     if (log) {
  //       console.log(store);
  //     }
  //     const unsub = store.subscribe(callback, log);
  //     return () => {
  //       unsub();
  //     };
  //   },
  //   [props.events]
  // );
  const [subscribe] = useState(() => store.subscribe());
  store.register(subscribe);

  return useSyncExternalStore(
    subscribe,
    () => store.getData(subscribe, { events: props.events }),
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
