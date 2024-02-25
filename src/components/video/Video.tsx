"use client";

import React, {
  DetailedHTMLProps,
  VideoHTMLAttributes,
  useRef,
  useContext,
  useId,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { useAudioState, useVideo } from "./hook";
import { MuteUnmuteBtn, VolumeSlider } from "./Audio";

export const videoCtx = React.createContext<{
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  state: VideoState;
  changeVideoState: React.Dispatch<ChangeVideoStateAction>;
  audio: ReturnType<typeof useAudioState>;
}>({
  videoRef: { current: null },
  state: {
    autoPlay: false,
    state: "paused",
    currentTime: 0,
    duration: 0,
    fullscreen: false,
  },
  changeVideoState: () => {},
  audio: {
    ref: { current: null },
    state: {
      autoPlay: false,
      playState: "paused",
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      muted: false,
    },
    changeState: () => {},
  },
});

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
export function Video2({
  autoPlay,
  children,
  sources,
  audioSources,
  muted,
  onPlay,
  onPause,
  onTimeUpdate,
  onLoadedMetadata,
  ...props
}: DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
> & {
  sources: string[];
  audioSources: string[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audio = useAudioState({
    defaultValues: {
      autoPlay: autoPlay ?? false,
      playState: autoPlay ? "playing" : "paused",
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      muted: muted ?? true,
    },
  });
  const { ref: audioRef, changeState: changeAudioState } = audio;
  const { state: videoState, changeState: changeVideoState } = useVideo({
    defaultValues: {
      autoPlay: autoPlay || false,
      state: autoPlay ? "playing" : "paused",
      currentTime: 0,
      duration: 0,
      fullscreen: false,
    },
    audio,
  });

  const playVideo: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const video = event.currentTarget;
    changeVideoState({ type: "play", video });
    onPlay?.(event);
  };

  const pauseVideo: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const video = event.currentTarget;
    changeVideoState({ type: "pause", video });
    onPause?.(event);
  };

  const loadedMetadata: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const video = event.currentTarget;
    changeVideoState({ type: "mutate", state: { duration: video.duration } });
    onLoadedMetadata?.(event);
  };

  const updateTime: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const video = event.currentTarget;
    changeVideoState({
      type: "mutate",
      state: { currentTime: video.currentTime, duration: video.duration },
    });
    onTimeUpdate?.(event);
  };

  const loadAudioMetaData = (
    event: React.SyntheticEvent<HTMLAudioElement, Event>,
  ) => {
    event.currentTarget.volume = 0.5;
    changeAudioState({ type: "mutate", state: { volume: 0.5 } });
  };

  const updateAudioTime = (
    event: React.SyntheticEvent<HTMLAudioElement, Event>,
  ) => {
    changeAudioState({
      type: "mutate",
      state: { currentTime: event.currentTarget.currentTime },
    });
  };

  const playAudio = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    event.currentTarget.currentTime = videoState.currentTime;
    changeAudioState({ type: "play", audio: event.currentTarget });
  };

  const pauseAudio = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    event.currentTarget.currentTime = videoState.currentTime;
    changeAudioState({ type: "pause", audio: event.currentTarget });
  };

  return (
    <videoCtx.Provider
      value={{ videoRef: videoRef, state: videoState, changeVideoState, audio }}
    >
      <video
        muted={videoState.autoPlay}
        autoPlay={videoState.autoPlay}
        onPlay={playVideo}
        onPause={pauseVideo}
        onLoadedMetadata={loadedMetadata}
        onTimeUpdate={updateTime}
        ref={videoRef}
        {...props}
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
        ref={audioRef}
        onLoadedMetadata={loadAudioMetaData}
        onTimeUpdate={updateAudioTime}
        onPlay={playAudio}
        onPause={pauseAudio}
        muted={audio.state.muted}
      >
        {audioSources.map((source) => {
          return <source src={source} />;
        })}
      </audio>
      {children}
    </videoCtx.Provider>
  );
}

export function PlayPauseBtn({
  onClick,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const {
    videoRef,
    state: videoState,
    changeVideoState,
  } = useContext(videoCtx);
  const { state } = videoState;
  const paused = state === "paused";

  return (
    <button
      type="button"
      aria-label={paused ? "Play" : "Pause"}
      onClick={(event) => {
        if (paused) {
          changeVideoState({ type: "play", video: videoRef.current });
          onClick?.(event);
          return;
        }
        changeVideoState({ type: "pause", video: videoRef.current });
        onClick?.(event);
      }}
      className="focus:outline outline-1 h-8 w-6 grid place-items-center"
      {...props}
    >
      <svg width={16} height={16} fill="white">
        <use
          width={16}
          height={16}
          xlinkHref={
            paused
              ? "/svg/sprites/actions.svg#play"
              : "/svg/sprites/actions.svg#pause"
          }
        />
      </svg>
    </button>
  );
}

export function ProgressBar() {
  const { videoRef, state, changeVideoState } = useContext(videoCtx);
  const { duration, currentTime } = state;

  return (
    <div
      onClick={(event) => {
        const progress = event.currentTarget;
        const rect = event.currentTarget.getBoundingClientRect();
        const pos = (event.pageX - rect.left) / progress.offsetWidth;
        const newCurrentTime = pos * duration;
        changeVideoState({
          type: "seek",
          to: newCurrentTime,
          video: videoRef.current,
        });
        // @ts-ignore
        progress.children.item(0)!.style.width = event.pageX - rect.left + "px";
      }}
      className="relative h-1 bg-white_primary/60 overflow-hidden"
    >
      <span
        style={{
          width: duration ? `calc(${(currentTime / duration) * 100}%)` : "",
        }}
        className="absolute inset-0 w-0 bg-primary"
      ></span>
    </div>
  );
}

export function FullScreenBtn({
  containerSelector,
}: {
  containerSelector: string;
}) {
  return (
    <button
      onClick={() => {
        if (typeof document === "undefined") {
          return;
        }
        if (document.fullscreenElement !== null) {
          document.exitFullscreen();
        } else {
          const videoContainer = document.querySelector(containerSelector);
          if (!videoContainer) {
            return;
          }
          videoContainer.requestFullscreen();
        }
      }}
      className="focus:outline outline-1 h-8 w-6 grid place-items-center"
    >
      <svg fill="none" stroke="white" strokeWidth={3} width={16} height={16}>
        <use
          width={16}
          height={16}
          xlinkHref={
            typeof document !== "undefined" && document.fullscreenElement
              ? "/svg/sprites/actions.svg#normal-screen"
              : "/svg/sprites/actions.svg#fullscreen"
          }
        />
      </svg>
    </button>
  );
}

export function BasicVideo({
  sources,
  audioSources,
}: {
  sources: string[];
  audioSources: string[];
}) {
  const id = useId();
  return (
    <div className="relative w-full">
      <Video2
        id={id}
        autoPlay
        audioSources={audioSources}
        sources={sources}
        className="w-full"
      >
        <Controls
          timeout={5000}
          className="absolute bottom-0 left-0 right-0 mx-8 pb-2"
        >
          <ProgressBar />
          <ul className="flex">
            <li>
              <PlayPauseBtn />
            </li>
            <li className="flex gap-2 group/audio-controls items-center">
              <MuteUnmuteBtn />
              <VolumeSlider />
            </li>
            <li className="ml-auto">
              <FullScreenBtn containerSelector="#test-video" />
            </li>
          </ul>
        </Controls>
      </Video2>
    </div>
  );
}

type ControlProps = {
  timeout: number;
};
export function Controls({
  children,
  timeout,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  ControlProps) {
  const [visible, setVisble] = useState(false);
  const { videoRef } = useContext(videoCtx);

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>;
    const mouseEnter = () => {
      clearTimeout(timeOut);
      setVisble(true);
    };

    const mouseLeave = () => {
      timeOut = setTimeout(() => {
        setVisble(false);
      }, timeout);
    };

    videoRef.current?.addEventListener("mouseenter", mouseEnter);
    videoRef.current?.addEventListener("mouseleave", mouseLeave);
    return () => {
      clearTimeout(timeOut);
      videoRef.current?.removeEventListener("mouseenter", mouseEnter);
    };
  }, [timeout]);

  return (
    <div
      className={
        "transition-opacity " +
        (visible ? "opacity-100 " : "opacity-0 ") +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}
