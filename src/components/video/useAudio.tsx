import { PropsWithChildren, createContext, useReducer, useRef } from "react";

export type AudioState = {
  autoPlay: boolean;
  playState: "playing" | "paused";
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
};

export type AudioStateAction =
  | {
      type: "play" | "pause" | "mute" | "unmute";
      // audio?: HTMLAudioElement | null;
    }
  | {
      type: "seek";
      to: number;
      // audio: HTMLAudioElement | null;
    }
  | {
      type: "volume";
      value: number;
      // audio: HTMLAudioElement | null;
    }
  | { type: "mutate"; state: Partial<AudioState> };

export function useAudio({ defaultValues }: { defaultValues: AudioState }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [state, changeState] = useReducer<
    (oldState: AudioState, action: AudioStateAction) => AudioState
  >((oldState, action) => {
    const { type } = action;
    if (type === "mutate") {
      const { state } = action;
      return { ...oldState, ...state };
    }
    const audio = ref.current;
    if (!audio) {
      return oldState;
    }
    if (type === "play") {
      audio.play();
    }
    if (type === "pause") {
      audio.pause();
    }
    if (type === "seek") {
      const { to } = action;
      audio.currentTime = to;
    }
    if (type === "mute") {
      audio.muted = true;
      audio.pause();
    }
    if (type === "unmute") {
      audio.muted = false;
      audio.play();
    }
    if (type === "volume") {
      const { value } = action;
      const volume = Math.min(Math.max(value, 0), 1);
      audio.volume = volume;
      if (!audio.muted && value === 0) {
        audio.muted = true;
      }
      if (audio.muted && value > 0) {
        audio.muted = false;
      }
    }

    return {
      ...oldState,
      playState: audio.paused ? "paused" : "playing",
      currentTime: audio.currentTime,
      duration: audio.duration,
      volume: audio.volume,
      muted: audio.muted,
    };
  }, defaultValues);

  const loadAudioMetaData = (
    event: React.SyntheticEvent<HTMLAudioElement, Event>,
  ) => {
    event.currentTarget.volume = 0.5;
    changeState({ type: "mutate", state: { volume: 0.5 } });
  };

  const updateAudioTime = (
    event: React.SyntheticEvent<HTMLAudioElement, Event>,
  ) => {
    changeState({
      type: "mutate",
      state: { currentTime: event.currentTarget.currentTime },
    });
  };

  const playAudio = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    // event.currentTarget.currentTime = videoState.currentTime;
    changeState({ type: "play" });
  };

  const pauseAudio = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    // event.currentTarget.currentTime = videoState.currentTime;
    changeState({ type: "pause" });
  };

  function register(
    props: React.DetailedHTMLProps<
      React.AudioHTMLAttributes<HTMLAudioElement>,
      HTMLAudioElement
    >,
  ) {
    const { onLoadedMetadata, onTimeUpdate, onPlay, onPause, ...rest } = props;

    return {
      onLoadedMetadata: (
        event: React.SyntheticEvent<HTMLAudioElement, Event>,
      ) => {
        onLoadedMetadata?.(event);
        loadAudioMetaData(event);
      },
      onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        onTimeUpdate?.(event);
        updateAudioTime(event);
      },
      onPlay: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        onPlay?.(event);
        playAudio(event);
      },
      onPause: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        onPause?.(event);
        pauseAudio(event);
      },
      ...rest,
    };
  }

  return { ref, state, changeState, register };
}

type AudioContext = {
  state: AudioState;
  changeState: (action: AudioStateAction) => void;
};
const audioCtx = createContext<AudioContext>({
  state: {
    autoPlay: false,
    playState: "paused",
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    muted: true,
  },
  changeState: () => {},
});

export function AudioProvider({
  children,
  audio,
}: PropsWithChildren<{
  audio: ReturnType<typeof useAudio>;
}>) {
  return <audioCtx.Provider value={audio}>{children}</audioCtx.Provider>;
}
