"use client";

import { FVideoFullInfo } from "@/database/repository/game/select";
import Image from "next/image";
import {
  DetailedHTMLProps,
  ReactEventHandler,
  VideoHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from "react";

export default function Video({
  video,
  customControls = true,
  playOnHover,
  containerClassName = "",
  onPlay,
  onPauseCapture,
  onLoadedMetadata,
  ...props
}: {
  video: FVideoFullInfo;
  customControls: boolean;
  playOnHover?: boolean;
  containerClassName?: string;
} & DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>) {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const [controlVisible, setControlVisible] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const thumbnail = video.thumbnail;
  const jsEnabled = useMemo(() => {
    return true;
  }, []);
  const controlVisibleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const _onPlay: ReactEventHandler<HTMLVideoElement> | undefined = (event) => {
    const audio = audioRef.current;
    const video = event.currentTarget;
    setPaused(false);
    if (!audio || audio.muted) {
      return;
    }
    audio.currentTime = video.currentTime;
    audio.play();
    onPlay?.(event);
  };

  const _onPauseCapture: ReactEventHandler<HTMLVideoElement> | undefined = (
    event,
  ) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    onPauseCapture?.(event);
    onLoadedMetadata?.(event);
  };

  const _onLoadedMetadata: ReactEventHandler<HTMLVideoElement> | undefined = (
    event,
  ) => {
    const progress = progressRef.current;
    const video = event.currentTarget;
    if (!progress) {
      return;
    }
    progress.setAttribute("max", video.duration.toString());
  };

  const _onTimeUpdate: ReactEventHandler<HTMLVideoElement> | undefined = (
    event,
  ) => {
    const progress = progressRef.current;
    const audio = audioRef.current;
    const video = event.currentTarget;
    if (audio && !video.paused && !video.ended && !audio.muted) {
      audio.currentTime = video.currentTime;
      audio.play();
    }
    if (!progress) {
      return;
    }
    if (!progress.getAttribute("max")) {
      progress.setAttribute("max", video.duration.toString());
    }
    const ratio = video.currentTime / video.duration;
    // @ts-ignore
    progress.children.item(0)!.style.width =
      progress.clientWidth * ratio + "px";
  };

  return (
    <div
      ref={videoContainerRef}
      className={"relative flex justify-center " + containerClassName}
    >
      <video
        ref={videoRef}
        autoPlay={false}
        muted
        preload="metadata"
        poster={thumbnail}
        controls={!jsEnabled}
        onPlay={_onPlay}
        onPauseCapture={_onPauseCapture}
        onLoadedMetadata={_onLoadedMetadata}
        onTimeUpdate={_onTimeUpdate}
        onPause={() => {
          setPaused(true);
        }}
        onMouseEnter={(event) => {
          if (playOnHover) {
            const video = event.currentTarget;
            video.play();
          }
          clearTimeout(controlVisibleTimeoutRef.current);
          setControlVisible(true);
          Object.assign(controlVisibleTimeoutRef, {
            current: setTimeout(() => {
              // setControlVisible(false);
            }, 5000),
          });
        }}
        onMouseMove={() => {
          clearTimeout(controlVisibleTimeoutRef.current);
          setControlVisible(true);
          Object.assign(controlVisibleTimeoutRef, {
            current: setTimeout(() => {
              // setControlVisible(false);
            }, 5000),
          });
        }}
        onMouseLeave={(event) => {
          if (playOnHover) {
            const video = event.currentTarget;
            video.pause();
          }
        }}
        {...props}
      >
        {video.recipes
          ?.filter((recipe) => !recipe.recipe?.includes("hls"))
          .map((recipe) => {
            const lowestVariant = recipe.variants.sort(
              ({ media_key: a }, { media_key: b }) => {
                if (a === "audio") {
                  return 1;
                }
                if (b === "audio") {
                  return -1;
                }
                if (
                  (a === "low" && (b === "medium" || b === "high")) ||
                  (a === "medium" && b === "high")
                ) {
                  return -1;
                }
                if (
                  (a === "high" && (b === "medium" || b === "low")) ||
                  (a === "medium" && b === "low")
                ) {
                  return 1;
                }
                return 0;
              },
            )[0];

            return (
              <source
                key={lowestVariant ? lowestVariant.ID : recipe.media_ref_id}
                src={lowestVariant ? lowestVariant.url : recipe.manifest}
                type={
                  lowestVariant
                    ? lowestVariant.content_type
                    : "video/" + recipe.recipe?.split("-")[1]
                }
              />
            );
          })}
      </video>
      <audio muted ref={audioRef}>
        {video.recipes
          ?.filter(
            (recipe) => !!recipe.variants && !recipe.recipe?.includes("hls"),
          )
          .map((recipe) => {
            const audioVariant = recipe.variants.find(
              (v) => v.media_key === "audio",
            );
            if (!audioVariant) {
              return null;
            }
            return <source key={audioVariant.ID} src={audioVariant.url} />;
          })}
      </audio>
      {customControls ? (
        <div
          onMouseEnter={() => {
            clearTimeout(controlVisibleTimeoutRef.current);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              // setControlVisible(false);
            }, 5000);
          }}
          className={
            " absolute w-full bottom-0 pb-2 mx-auto flex flex-col items-center gap-2 bg-gradient-to-t from-paper_3/60 via-paper_3/30 to-transparent " +
            (!controlVisible ? " hidden " : "")
          }
        >
          <div
            ref={progressRef}
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
              // @ts-ignore
              progress.children.item(0)!.style.width =
                event.pageX - rect.left + "px";
              if (audio) {
                audio.currentTime = pos * video.duration;
              }
            }}
            className="relative w-4/5 h-1 bg-white_primary/60 overflow-hidden"
          >
            <span className="absolute inset-0 w-0 bg-primary"></span>
          </div>
          <ul
            className={
              "w-[calc(80%+8px)] gap-4 " + (jsEnabled ? " flex " : " hidden ")
            }
          >
            <li>
              <button
                type="button"
                aria-label={paused ? "Play" : "Pause"}
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
                className="focus:outline outline-1 h-8 w-6 grid place-items-center"
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
            </li>
            <li className="flex items-center group/video-controls gap-2">
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => {
                  const audio = audioRef.current;
                  if (!audio) {
                    return;
                  }
                  setMuted(!audio.muted);
                  audio.muted = !audio.muted;
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
              <div
                className={
                  "h-1 bg-white_primary/60 transition-[width] relative overflow-hidden cursor-grab " +
                  " focus-within:overflow-visible  " +
                  " group-hover/video-controls:w-20 group-hover/video-controls:overflow-visible " +
                  " peer-hover/audio-toggle-muted:w-20 peer-hover/audio-toggle-muted:overflow-visible " +
                  " peer-focus/audio-toggle-muted:w-20 focus-within/audio-toggle-muted:w-20 peer-focus/audio-toggle-muted:overflow-visible"
                }
              >
                <span
                  style={{
                    width: (audioRef.current?.volume || 0) * 80 + "px",
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
                    const audio = audioRef.current;
                    if (!audio || event.pageX <= 0) {
                      return;
                    }
                    const offset = event.nativeEvent.offsetX - 6;
                    if (offset <= 0) {
                      audio.volume = 0;
                      setVolume(0);
                      setMuted(true);
                      return;
                    }
                    if (offset > 80) {
                      audio.volume = 1;
                      setVolume(1);
                      setMuted(false);
                      return;
                    }
                    audio.volume = offset / 80;
                    setVolume(audio.volume);
                  }}
                  onDragStart={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                  onClick={(event) => {
                    const audio = audioRef.current;
                    if (!audio || event.pageX <= 0) {
                      return;
                    }
                    const offset = event.nativeEvent.offsetX - 6;
                    if (offset <= 0) {
                      audio.volume = 0;
                      setVolume(0);
                      setMuted(true);
                      return;
                    }
                    if (offset > 80) {
                      audio.volume = 1;
                      setVolume(1);
                      setMuted(false);
                      return;
                    }
                    audio.volume = offset / 80;
                    setVolume(audio.volume);
                  }}
                />
              </div>
            </li>
            <li
              aria-label={
                typeof document !== "undefined" && document.fullscreenElement
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
              className="ml-auto"
            >
              <button
                onClick={() => {
                  if (typeof document === "undefined") {
                    return;
                  }
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
                className="focus:outline outline-1 h-8 w-6 grid place-items-center"
              >
                <svg
                  fill="none"
                  stroke="white"
                  strokeWidth={3}
                  width={16}
                  height={16}
                >
                  <use
                    width={16}
                    height={16}
                    xlinkHref={
                      typeof document !== "undefined" &&
                      document.fullscreenElement
                        ? "/svg/sprites/actions.svg#normal-screen"
                        : "/svg/sprites/actions.svg#fullscreen"
                    }
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function VideoPreview({ video }: { video: any }) {
  const recipe = video[0];
  const thumbnail = recipe.outputs[1];

  return <Image src={thumbnail.url} alt={""} />;
}
