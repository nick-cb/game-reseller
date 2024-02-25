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

function updateStore(audio: HTMLAudioElement, index: number) {
  store[index] = {
    playing: !audio.paused,
    muted: audio.muted,
    volume: audio.volume,
    currentTime: audio.currentTime,
    progress: audio.duration,
    play: async () => audio.play(),
    pause: () => audio.pause(),
  };
}

function update({ callback, index }: Payload) {
  return (event: Event) => {
    const audio = event.currentTarget as HTMLAudioElement;
    updateStore(audio, index);
    callback();
  };
}

export function useAudio(value?: { events?: Events }) {
  const { events = ['play', 'pause', 'volumechange', 'seek', 'timeupdate'] } = value || {};
  const { index, audioRef } = useContext(AudioCtx);
  const subscribe = useCallback(
    (callback: () => void) => {
      const audio = audioRef?.current;
      if (!audio) {
        return () => {};
      }

      const play = update({ callback, index });
      const pause = update({ callback, index });
      const volumechange = update({ callback, index });
      const seek = update({ callback, index });
      const timeupdate = update({ callback, index });
      const handlers = { play, pause, volumechange, seek, timeupdate };

      events.map((event) => {
        audio.addEventListener(event, handlers[event]);
      });
      // console.info(`subscribed to audio store, audio ${index}`, audio);

      updateStore(audio, index);
      return () => {
        events.map((event) => {
          audio.removeEventListener(event, handlers[event]);
        });
        // console.info(`unsubscribed to audio store, audio ${index}`);
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

type AudioContext = {
  index: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  selector?: string;
};
export const AudioCtx = createContext<AudioContext>({
  index: -1,
  audioRef: { current: null },
  selector: undefined,
});
export function AudioContainer(props: React.PropsWithChildren) {
  const { children } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const index = useMemo(() => {
    return store.push({ ...defaultData }) - 1;
  }, []);

  return (
    <AudioCtx.Provider value={{ index, audioRef, selector: undefined }}>
      {children}
    </AudioCtx.Provider>
  );
}
