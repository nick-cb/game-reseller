"use client";

import { useContext } from "react";
import { videoCtx } from "./Video";

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
      audio?: HTMLAudioElement | null;
    }
  | {
      type: "seek";
      to: number;
      audio: HTMLAudioElement | null;
    }
  | {
      type: "volume";
      value: number;
      audio: HTMLAudioElement | null;
    }
  | { type: "mutate"; state: Partial<AudioState> };

export function MuteUnmuteBtn() {
  const {
    audio: {
      ref,
      state: { muted, volume },
      changeState,
    },
  } = useContext(videoCtx);
  return (
    <>
      <button
        type="button"
        aria-label={muted ? "Unmute" : "Mute"}
        onClick={() => {
          if (muted) {
            changeState({ type: "unmute", audio: ref.current });
          } else {
            changeState({ type: "mute", audio: ref.current });
          }
        }}
        className="focus:outline outline-1 h-8 w-6 grid place-items-center peer/audio-toggle-muted"
      >
        <svg width={14} height={18} fill="white">
          <use
            width={16}
            height={18}
            xlinkHref={
              muted
                ? "/svg/sprites/actions.svg#no-audio"
                : volume > 0.7
                ? "/svg/sprites/actions.svg#audio"
                : volume > 0.4
                ? "/svg/sprites/actions.svg#audio-low"
                : "/svg/sprites/actions.svg#sound"
            }
          />
        </svg>
      </button>
    </>
  );
}

export function VolumeSlider() {
  const {
    audio: {
      ref,
      state: { volume },
      changeState,
    },
  } = useContext(videoCtx);
  return (
    <div
      className={
        "h-1 bg-white_primary/60 transition-[width] relative overflow-hidden cursor-grab " +
        " focus-within:overflow-visible  " +
        " group-hover/audio-controls:w-20 group-hover/audio-controls:overflow-visible " +
        " peer-hover/audio-toggle-muted:w-20 peer-hover/audio-toggle-muted:overflow-visible " +
        " peer-focus/audio-toggle-muted:w-20 focus-within/audio-toggle-muted:w-20 peer-focus/audio-toggle-muted:overflow-visible"
      }
    >
      <span
        style={{
          width: (volume || 0) * 80 + "px",
        }}
        className="bg-primary absolute inset-0 w-0"
      />
      <button
        style={{
          translate: `clamp(-6px, ${volume * 80 - 6}px, 74px)`,
        }}
        className="w-3 h-3 bg-white rounded-full absolute top-1/2 -translate-y-1/2"
      ></button>
      <span
        draggable
        className="absolute inset-0 h-3 -translate-y-1/2 top-1/2 w-[calc(100%+12px)] -translate-x-[6px]"
        onDrag={(event) => {
          const audio = ref.current;
          if (event.pageX <= 0) {
            return;
          }
          const offset = event.nativeEvent.offsetX - 6;
          const volume = offset / 80;
          if (volume >= 0 && volume <= 1) {
            changeState({ type: "volume", audio, value: volume });
          }
        }}
        onDragStart={(event) => {
          event.currentTarget.style.opacity = "0";
        }}
        onClick={(event) => {
          const audio = ref.current;
          if (event.pageX <= 0) {
            return;
          }
          const offset = event.nativeEvent.offsetX - 6;
          const volume = offset / 80;
          if (volume >= 0 && volume <= 1) {
            changeState({ type: "volume", audio, value: volume });
          }
        }}
      />
    </div>
  );
}
