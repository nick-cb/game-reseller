import {
  DetailedHTMLProps,
  Dispatch,
  PropsWithChildren,
  VideoHTMLAttributes,
  createContext,
  useContext,
  useReducer,
  useRef,
} from "react";
import { useAudio } from "./useAudio";

export type VideoState = {
  autoPlay: boolean;
  state: "playing" | "paused";
  currentTime: number;
  duration: number;
  fullscreen: boolean;
};
export type ChangeVideoStateAction =
  | {
      type: "play" | "pause";
      video: HTMLVideoElement | null;
    }
  | {
      type: "seek";
      to: number;
      video: HTMLVideoElement | null;
    }
  | {
      type: "mutate";
      state: Partial<VideoState>;
    };
type UseVideoParams = {
  defaultValues: VideoState;
};
export function useVideo({ defaultValues }: UseVideoParams) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, changeState] = useReducer<
    (oldState: VideoState, action: ChangeVideoStateAction) => VideoState
  >((oldState, action) => {
    const { type } = action;
    if (type === "mutate") {
      const { state } = action;
      return { ...oldState, ...state };
    }
    const { video } = action;
    if (!video) {
      return oldState;
    }
    if (type === "play") {
      video.play();
    }
    if (type === "pause") {
      video.pause();
    }
    if (type === "seek") {
      const { to } = action;
      video.currentTime = to;
    }
    return {
      duration: video.duration,
      currentTime: video.currentTime,
      state: video.paused ? "paused" : "playing",
      autoPlay: video.autoplay,
      fullscreen: false,
    };
  }, defaultValues);

  function _onPlay(event: React.SyntheticEvent<HTMLVideoElement, Event>) {
    const video = event.currentTarget;
    changeState({ type: "play", video });
  }

  function _onPause(event: React.SyntheticEvent<HTMLVideoElement, Event>) {
    const video = event.currentTarget;
    changeState({ type: "pause", video });
  }

  function _onLoadedMetadata(
    event: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) {
    const video = event.currentTarget;
    changeState({ type: "mutate", state: { duration: video.duration } });
  }

  function _onTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement, Event>) {
    const video = event.currentTarget;
    changeState({
      type: "mutate",
      state: { currentTime: video.currentTime, duration: video.duration },
    });
  }

  function register(
    props?: DetailedHTMLProps<
      VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
  ) {
    const { onPlay, onPause, onLoadedMetadata, onTimeUpdate, ...rest } =
      props || {};

    return {
      ref,
      onPlay: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        _onPlay(event);
        onPlay?.(event);
      },
      onPause: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        _onPause(event);
        onPause?.(event);
      },
      onLoadedMetadata: (
        event: React.SyntheticEvent<HTMLVideoElement, Event>,
      ) => {
        _onLoadedMetadata(event);
        onLoadedMetadata?.(event);
      },
      onTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        _onTimeUpdate(event);
        onTimeUpdate?.(event);
      },
      ...rest,
    };
  }

  return {
    ref,
    state,
    changeState,
    register,
  };
}

type VideoContext = {
  state: VideoState;
  changeState: Dispatch<ChangeVideoStateAction>;
};
const videoCtx = createContext<VideoContext>({
  state: {
    autoPlay: false,
    currentTime: 0,
    duration: 0,
    fullscreen: false,
    state: "paused",
  },
  changeState: () => {},
});

export function VideoProvider({
  video,
  children,
}: PropsWithChildren<{
  video: ReturnType<typeof useVideo>;
}>) {
  return <videoCtx.Provider value={video}>{children}</videoCtx.Provider>;
}

export function useVideoContext() {
  return useContext(videoCtx);
}

export function Video({
  autoPlay,
  muted,
  sources,
  audioSources,
  children,
  ...props
}: DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
> & {
  sources: string[];
  audioSources: string[];
}) {
  const video = useVideo({
    defaultValues: {
      autoPlay: autoPlay ?? false,
      state: autoPlay ? "playing" : "paused",
      currentTime: 0,
      duration: 0,
      fullscreen: false,
    },
  });
  const audio = useAudio({
    defaultValues: {
      autoPlay: autoPlay ?? false,
      playState: autoPlay ? "playing" : "paused",
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      muted: muted ?? true,
    },
  });
  const { state, register } = video;
  const { changeState: changeAudioState, ref: audioRef } = audio;

  const playVideo: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    changeAudioState({ type: "play" });
  };

  const pauseVideo: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    changeAudioState({ type: "pause" });
  };

  const updateTime: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const video = event.currentTarget;
    changeAudioState({ type: "seek", to: video.currentTime });
  };

  const loadMetaData: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const video = event.currentTarget;
    changeAudioState({ type: "mutate", state: { duration: video.duration } });
  };

  const onPlayAudio: React.ReactEventHandler<HTMLAudioElement> = (event) => {
    const audio = event.currentTarget;
    audio.currentTime = state.currentTime;
  };

  const pauseAudio: React.ReactEventHandler<HTMLAudioElement> = (event) => {
    const audio = event.currentTarget;
    audio.currentTime = state.currentTime;
  };

  return (
    <videoCtx.Provider value={video}>
      <video
        muted={state.autoPlay}
        autoPlay={state.autoPlay}
        {...register(props)}
      >
        {sources.map((source) => {
          return (
            <source
              src={source}
              type={`video/${source.split(".").pop()}`}
            ></source>
          );
        })}
      </video>
      <audio
        muted={audio.state.muted}
        autoPlay={audio.state.autoPlay}
        {...audio.register({ onPlay: onPlayAudio, onPause: pauseAudio })}
        // ref={audioRef}
        // onLoadedMetadata={loadAudioMetaData}
        // onTimeUpdate={updateAudioTime}
        // onPlay={playAudio}
        // onPause={pauseAudio}
        // muted={audio.state.muted}
      >
        {audioSources.map((source) => {
          return <source src={source} />;
        })}
      </audio>
      {children}
    </videoCtx.Provider>
  );
}
