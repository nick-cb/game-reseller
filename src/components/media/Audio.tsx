'use client';

import { Mutable } from '@/utils';
import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
  use,
} from 'react';

const defaultData = {
  playing: false,
  muted: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  audio: undefined as HTMLAudioElement | undefined,
};
type AudioState = typeof defaultData;
const store: AudioState[] = [];
function updateStore(audio: HTMLAudioElement, index: number) {
  store[index] = {
    playing: !audio.paused,
    muted: audio.muted,
    volume: audio.volume,
    currentTime: audio.currentTime,
    duration: audio.duration,
    audio: audio,
  };
}

const events = ['play', 'pause', 'volumechange', 'seek', 'timeupdate', 'loadedmetadata'] as const;
const defaultProps = {
  events: events as Mutable<typeof events>,
};
type UseAudioProps = {
  events: (typeof defaultProps)['events'][number][];
};
export function useAudio(props: UseAudioProps = defaultProps) {
  const { index, audioRef } = use(AudioCtx);
  const subscribe = useCallback(
    (callback: () => void) => {
      const audio = audioRef?.current;
      if (!audio) {
        return () => {};
      }
      function notify() {
        const audio = audioRef?.current;
        if (!audio) {
          return;
        }
        updateStore(audio, index);
        callback();
      }
      // - At this point, there is a chance that loadedmetadata already fired,
      //   so the store won't be updated by that event and we have to update store manually
      if (audio.readyState >= 1 && Object.is(store[index], defaultData)) {
        updateStore(audio, index);
      }
      for (const event of props.events) {
        audio.addEventListener(event, notify);
      }
      return () => {
        for (const event of props.events) {
          audio.removeEventListener(event, notify);
        }
      };
    },
    [index, props.events]
  );

  return useSyncExternalStore(
    subscribe,
    () => store[index],
    () => defaultData
  );
}

type AudioContext = {
  index: number;
  audioRef?: React.RefObject<HTMLAudioElement>;
};
export const AudioCtx = createContext<AudioContext>({
  index: -1,
  audioRef: { current: null },
});
export function AudioContainer(props: React.PropsWithChildren<Omit<AudioContext, 'index'>>) {
  const { children } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const index = useMemo(() => {
    return store.push({ ...defaultData }) - 1;
  }, []);

  return <AudioCtx.Provider value={{ index, audioRef }}>{children}</AudioCtx.Provider>;
}
