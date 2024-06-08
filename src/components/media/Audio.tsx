'use client';

import { createContext, use, useRef, useState, useSyncExternalStore } from 'react';

type AudioEvents = (typeof Store)['events'][number][];
class Store {
  public static readonly events = [
    'play',
    'pause',
    'volumechange',
    'seek',
    'timeupdate',
    'loadedmetadata',
  ] as const;
  audioRef: React.RefObject<HTMLAudioElement>;
  data = {
    event: undefined as undefined | AudioEvents[number],
    playing: false,
    muted: false,
    volume: 0,
    currentTime: 0,
    duration: 0,
    audio: undefined as HTMLAudioElement | undefined,
  };
  listenerData: Map<Symbol, Store['data']> = new Map();
  listeners: Set<() => void> = new Set();

  constructor(audioRef: React.RefObject<HTMLAudioElement>) {
    this.audioRef = audioRef;
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: () => void) {
    const audio = this.audioRef.current;
    if (!audio) {
      return () => {};
    }
    audio.volume = 0;
    const notify = (event: Event) => {
      const audio = this.audioRef.current;
      if (!audio) {
        return;
      }
      const type = event.type as AudioEvents[number];
      this.data = {
        event: type,
        playing: !audio?.paused,
        muted: audio?.muted,
        volume: audio?.volume,
        currentTime: audio?.currentTime,
        duration: audio?.duration,
        audio,
      };
      for (const listener of this.listeners) {
        listener();
      }
    };
    if (!this.listeners.size) {
      if (audio.readyState >= 1) {
        notify({ type: 'loadedmetadata' } as Event);
      }
      for (const event of Store.events) {
        audio.addEventListener(event, notify);
      }
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size) {
        for (const event of Store.events) {
          audio.removeEventListener(event, notify);
        }
      }
    };
  }

  getData(symbol: Symbol) {
    return (options: UseAudioProps) => {
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

type UseAudioProps = {
  events: AudioEvents;
};
export function useAudio(props: UseAudioProps = { events: [...Store.events] }) {
  const { store } = use(AudioCtx);
  const [reg] = useState(() => store.register());
  return useSyncExternalStore(
    reg.subscribe,
    () => reg.getData(props),
    () => store.data
  );
}

type AudioContext = {
  store: Store;
  audioRef?: React.RefObject<HTMLAudioElement>;
};
export const AudioCtx = createContext<AudioContext>({
  store: new Store({ current: null }),
  audioRef: { current: null },
});
export function AudioContainer(props: React.PropsWithChildren<Omit<AudioContext, 'store'>>) {
  const { children } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [store] = useState(new Store(audioRef));

  return <AudioCtx.Provider value={{ store, audioRef }}>{children}</AudioCtx.Provider>;
}
