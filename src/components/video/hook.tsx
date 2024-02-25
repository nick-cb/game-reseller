import { useReducer, useRef } from "react";
import { VideoState, ChangeVideoStateAction } from "./Video";
import { AudioState, AudioStateAction } from "./Audio";

type UseVideoParams = {
  defaultValues: VideoState;
  audio: ReturnType<typeof useAudioState>;
};
export function useVideo({ defaultValues, audio }: UseVideoParams) {
  const { ref: audioRef, changeState: changeAudioState } = audio;
  const [state, changeState] = useReducer<
    (oldState: VideoState, action: ChangeVideoStateAction) => VideoState
  >((oldState, action) => {
    const { type } = action;
    if (type === "mutate") {
      const { state } = action;
      return { ...oldState, ...state };
    }
    const { video } = action;
    const audio = audioRef.current;
    if (!video) {
      return oldState;
    }
    if (type === "play") {
      video.play();
      changeAudioState({
        type: "play",
        audio,
      });
    }
    if (type === "pause") {
      video.pause();
      changeAudioState({
        type: "pause",
        audio,
      });
    }
    if (type === "seek") {
      const { to } = action;
      video.currentTime = to;
      changeAudioState({
        type: "seek",
        audio,
        to,
      });
    }

    return {
      duration: video.duration,
      currentTime: video.currentTime,
      state: video.paused ? "paused" : "playing",
      autoPlay: video.autoplay,
      fullscreen: false,
    };
  }, defaultValues);

  return { state, changeState, audio };
}

export function useAudioState({
  defaultValues,
}: {
  defaultValues: AudioState;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [state, changeState] = useReducer<
    (oldState: AudioState, action: AudioStateAction) => AudioState
  >((oldState, action) => {
    const { type } = action;
    if (type === "mutate") {
      const { state } = action;
      return { ...oldState, ...state };
    }
    const { audio } = action;
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

  return { ref, state, changeState };
}
