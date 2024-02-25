'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';

type Payload = {
  index: number;
  callback: () => void;
};
type Events = ('play' | 'pause' | 'volumechange' | 'seek' | 'timeupdate')[];

const defaultData = {
  playing: false,
  muted: false,
  volume: 0,
  currentTime: 0,
  progress: 0,
  play: async () => {},
  pause: () => {},
};
Object.freeze(defaultData);
const store: (typeof defaultData)[] = [];

function updateStore(video: HTMLVideoElement, index: number) {
  store[index] = {
    playing: !video.paused,
    muted: video.muted,
    volume: video.volume,
    currentTime: video.currentTime,
    progress: video.duration,
    play: async () => video.play(),
    pause: () => video.pause(),
  };
}

function update({ callback, index }: Payload) {
  return (event: Event) => {
    const video = event.currentTarget as HTMLVideoElement;
    updateStore(video, index);
    callback();
  };
}

export function useVideo(value?: { events?: Events }) {
  const { events = ['play', 'pause', 'volumechange', 'seek', 'timeupdate'] } = value || {};
  const { index, videoRef } = useContext(VideoCtx);
  const subscribe = useCallback(
    (callback: () => void) => {
      const video = videoRef?.current;
      if (!video) {
        return () => {};
      }

      const play = update({ callback, index });
      const pause = update({ callback, index });
      const volumechange = update({ callback, index });
      const seek = update({ callback, index });
      const timeupdate = update({ callback, index });
      const handlers = { play, pause, volumechange, seek, timeupdate };

      events.map((event) => {
        video.addEventListener(event, handlers[event]);
      });
      // console.info(`subscribed to video store, video ${index}`, video);

      updateStore(video, index);
      return () => {
        events.map((event) => {
          video.removeEventListener(event, handlers[event]);
        });
        // console.info(`unsubscribed to video store, video ${index}`);
      };
    },
    [index]
  );

  return useSyncExternalStore(
    subscribe,
    () => {
      if (index !== -1) {
        return store[index];
      }
      return defaultData;
    },
    () => defaultData
  );
}

type VideoContext = {
  index: number;
  videoRef?: React.RefObject<HTMLVideoElement>;
  selector?: string;
};
export const VideoCtx = createContext<VideoContext>({
  index: -1,
  videoRef: { current: null },
  selector: undefined,
});
export function VideoContainer(props: React.PropsWithChildren<Omit<VideoContext, 'index'>>) {
  const { children, selector } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const index = useMemo(() => {
    return store.push({ ...defaultData }) - 1;
  }, []);

  return <VideoCtx.Provider value={{ index, videoRef, selector }}>{children}</VideoCtx.Provider>;
}
