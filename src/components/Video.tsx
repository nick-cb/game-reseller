"use client";

import Image from "next/image";
import {
  DetailedHTMLProps,
  VideoHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

type VideoState = {
  paused: boolean;
  ended: boolean;
  muted: boolean;
};
export default function Video({
  video,
  ...props
}: { video: any } & DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);
  const thumbnail = video.thumbnail;

  const jsEnabled = useMemo(() => {
    return true;
  }, []);

  return (
    <div ref={videoContainerRef} className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        preload="metadata"
        poster={thumbnail}
        controls={!jsEnabled}
        {...props}
        onPlay={(event) => {
          const audio = audioRef.current;
          const video = event.currentTarget;
          if (!audio) {
            return;
          }
          audio.currentTime = video.currentTime;
          audio.play();
        }}
        onPauseCapture={(event) => {
          const audio = audioRef.current;
          if (!audio) {
            return;
          }
          audio.pause();
        }}
        onLoadedMetadata={(event) => {
          const progress = progressRef.current;
          const video = event.currentTarget;
          if (!progress) {
            return;
          }
          progress.setAttribute("max", video.duration.toString());
        }}
        onTimeUpdate={(event) => {
          const progress = progressRef.current;
          const audio = audioRef.current;
          const video = event.currentTarget;
          if (audio && !video.paused && !video.ended) {
            audio.currentTime = video.currentTime;
            audio.play();
          }
          if (!progress) {
            return;
          }
          if (!progress.getAttribute("max")) {
            progress.setAttribute("max", video.duration.toString());
          }
          progress.value = video.currentTime;
        }}
      >
        {video.recipes.map((recipe: any) => {
          const lowestVariant = recipe.variants?.find(
            (v: any) =>
              v.key === "low" || v.key === "medium" || v.key === "high"
          );
          return (
            <source
              key={lowestVariant ? lowestVariant.ID : recipe.media_ref_id}
              src={lowestVariant ? lowestVariant.url : recipe.manifest}
              type={
                lowestVariant
                  ? lowestVariant.contentType
                  : "video/" + recipe.recipe.split("-")[1]
              }
            />
          );
        })}
      </video>
      <audio muted ref={audioRef}>
        {video.recipes
          .filter((recipe: any) => !!recipe.variants)
          .map((recipe: any) => {
            const audioVariant = recipe.variants.find(
              (v: any) => v.key === "audio"
            );
            if (!audioVariant) {
              return null;
            }
            return <source key={audioVariant.ID} src={audioVariant.url} />;
          })}
      </audio>
      <ul
        className={
          "absolute bottom-0 w-full justify-between " +
          (jsEnabled ? " flex " : " hidden ")
        }
      >
        <li>
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              if (!video) {
                return;
              }
              if (video.paused || video.ended) {
                video.play();
              } else {
                video.pause();
              }
            }}
          >
            Play/Pause
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              const progress = progressRef.current;
              if (!video || !progress) {
                return;
              }
              video.pause();
              video.currentTime = 0;
              progress.value = 0;
            }}
          >
            Stop
          </button>
        </li>
        <li>
          <progress
            ref={progressRef}
            value={0}
            min={0}
            onClick={(event) => {
              const progress = event.currentTarget;
              const video = videoRef.current;
              const audio = audioRef.current;
              if (!video) {
                return;
              }
              const rect = event.currentTarget.getBoundingClientRect();
              const pos = (event.pageX - rect.left) / progress.offsetWidth;
              video.currentTime = pos * video.duration;
              progress.value = pos * video.duration;
              if (audio) {
                audio.currentTime = pos * video.duration;
              }
            }}
          >
            <span></span>
          </progress>
        </li>
        <li>
          <button
            type="button"
            onClick={(event) => {
              const audio = audioRef.current;
              if (!audio) {
                return;
              }
              audio.muted = !audio.muted;
            }}
          >
            Mute/Unmute
          </button>
        </li>
        <li>
          <button type="button">Vol+</button>
        </li>
        <li>
          <button type="button">Vol-</button>
        </li>
        <li
          onClick={() => {
            if (document.fullscreenElement !== null) {
              document.exitFullscreen();
            } else {
              const videoContainer = videoContainerRef.current;
              if (!videoContainer) {
                return;
              }
              videoContainer.requestFullscreen();
            }
          }}
        >
          <button type="button">Fullscreen</button>
        </li>
      </ul>
    </div>
  );
}

export function VideoPreview({ video }: { video: any }) {
  const recipe = video[0];
  const thumbnail = recipe.outputs[1];

  return <Image src={thumbnail.url} alt={""} />;
}
