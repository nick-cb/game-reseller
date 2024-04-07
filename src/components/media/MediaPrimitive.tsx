'use client';

import React, { use, useEffect } from 'react';
import { VideoCtx, useVideo } from './Video';
import { AudioCtx, useAudio } from './Audio';
import { isNil, mergeCls } from '@/utils';
import { Icon } from '../Icon';

export function Video(props: React.JSX.IntrinsicElements['video']) {
  const { videoRef } = use(VideoCtx);

  return <video ref={videoRef} {...props} />;
}

export function PlayPauseBtn(props: JSX.IntrinsicElements['button']) {
  const { className, onClick } = props;
  const { audio } = useAudio({ events: ['play', 'pause', 'loadedmetadata'] });
  const { playing, video } = useVideo({ events: ['play', 'pause', 'loadedmetadata'] });
  function play(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    video?.play();
    audio?.play();
    onClick?.(event);
  }
  function pause(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    video?.pause();
    audio?.pause();
    onClick?.(event);
  }

  return (
    <button
      onClick={playing ? pause : play}
      className={mergeCls(
        'border-none bg-none px-1',
        'focus:outline focus:outline-1 focus:outline-white',
        'transition-colors',
        className
      )}
      {...props}
    >
      {playing ? <Icon name="pause" fill="white" /> : <Icon name="play" fill="white" />}
    </button>
  );
}

export function Timer() {
  const { currentTime, duration } = useVideo({ events: ['timeupdate', 'loadedmetadata'] });
  if (isNil(duration) || isNil(currentTime)) {
    return null;
  }

  const currentMinute = Math.floor(currentTime / 60);
  const currentSecond = (Math.floor(currentTime) % 60).toString().padStart(2, '0');
  const totalMinute = Math.floor(duration / 60);
  const totalSecond = (Math.floor(duration) % 60).toString().padStart(2, '0');
  const format = `${currentMinute}:${currentSecond}/${totalMinute}:${totalSecond}`;

  return <div className="tabular-nums">{format}</div>;
}

export function Audio(props: JSX.IntrinsicElements['audio']) {
  const { audioRef } = use(AudioCtx);
  return <audio ref={audioRef} {...props} />;
}

export function VideoAudio(props: JSX.IntrinsicElements['audio']) {
  const { audioRef } = use(AudioCtx);
  const { currentTime } = useVideo({ events: ['timeupdate', 'loadedmetadata'] });

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  return <audio ref={audioRef} {...props} />;
}

export function VolumeSlider(props: JSX.IntrinsicElements['input']) {
  const { className, ...rest } = props;
  const { video } = useVideo({ events: ['volumechange', 'loadedmetadata'] });
  const { volume, audio } = useAudio({ events: ['volumechange', 'loadedmetadata'] });

  function changeVolume(event: React.FormEvent<HTMLInputElement>) {
    const value = (event.target as HTMLInputElement).value;
    if (audio) {
      audio.volume = parseInt(value) / 100;
    }
    if (video) {
      video.volume = parseInt(value) / 100;
    }
  }

  return (
    <input
      type="range"
      min={0}
      max={100}
      value={volume * 100}
      onInput={changeVolume}
      className={mergeCls('relative w-full', className)}
      {...rest}
    />
  );
}

export function VolumeProgress() {
  const { volume } = useAudio({ events: ['volumechange', 'loadedmetadata'] });
  return (
    <div className="absolute inset-0 flex items-center bg-none">
      <div style={{ width: volume * 80 }} className="h-1 bg-blue-500"></div>
      <div
        className="right-0 h-1 bg-white/30"
        style={{
          width: `calc(100% - ${volume * 100}%)`,
        }}
      ></div>
    </div>
  );
}

export function VolumeButton(props: JSX.IntrinsicElements['button']) {
  const { volume, audio } = useAudio({ events: ['volumechange', 'loadedmetadata'] });
  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!audio) {
      return;
    }
    if (volume === 1) {
      audio.volume = 0;
    } else {
      audio.volume = 1;
    }
    props.onClick?.(e);
  };

  return (
    <button
      {...props}
      className={mergeCls(
        'border-none bg-none px-1',
        'focus:outline focus:outline-1 focus:outline-white',
        'transition-colors',
        props.className
      )}
      onClick={click}
    >
      <Icon
        name={volume > 0.5 ? 'volume-up' : volume > 0 ? 'volume-down' : 'volume-mute'}
        fill="white"
        variant="fill"
      />
    </button>
  );
}

export function VideoProgressSlider(props: JSX.IntrinsicElements['input']) {
  const { audio } = useAudio();
  const { currentTime, duration, video } = useVideo();

  function seek(event: React.FormEvent<HTMLInputElement>) {
    const value = parseInt((event.target as HTMLInputElement).value);
    if (video) {
      video.currentTime = value;
    }
    if (audio) {
      audio.currentTime = value;
    }
  }

  return (
    <input
      {...props}
      type={props.type || 'range'}
      min={0}
      max={duration}
      value={currentTime}
      onInput={seek}
      className={mergeCls('relative w-full', props.className)}
    />
  );
}

export function VideoProgress() {
  const { currentTime, duration } = useVideo({
    events: ['timeupdate', 'loadedmetadata', 'seeking', 'seek'],
  });
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center bg-none">
      <div
        className="h-1 bg-blue-500"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      ></div>
      <div
        className="right-0 h-1 bg-white/30"
        style={{
          width: `calc(100% - ${(currentTime / duration) * 100}%)`,
        }}
      ></div>
    </div>
  );
}

export function FullScreenButton(props: JSX.IntrinsicElements['button']) {
  const { video, fullscreenElement } = useVideo({ events: ['loadedmetadata', 'fullscreenchange'] });
  function click(event: React.MouseEvent<HTMLButtonElement>) {
    if (fullscreenElement) {
      document.exitFullscreen();
    } else {
      video?.parentElement?.requestFullscreen();
    }
    props.onClick?.(event);
  }
  return (
    <button
      {...props}
      onClick={click}
      className={mergeCls(
        'border-none bg-none px-1',
        'focus:outline focus:outline-1 focus:outline-white',
        'transition-colors',
        props.className
      )}
    >
      {fullscreenElement ? (
        <Icon name="fullscreen-exit" fill="white" />
      ) : (
        <Icon name="fullscreen" fill="white" />
      )}
    </button>
  );
}

export function MediaControls() {
  const { video } = useVideo({ events: ['loadedmetadata'] });
  const audio = useAudio({ events: ['loadedmetadata'] });
  const shouldShowControls = !isNil(video) && !isNil(audio?.audio);

  return (
    <div
      style={{
        opacity: shouldShowControls ? 1 : 0,
        pointerEvents: shouldShowControls ? 'all' : 'none',
      }}
      className="absolute bottom-0 left-0 right-0 z-[1] bg-gradient-to-t from-black/50 transition-opacity"
    >
      <div className="relative mx-12 flex items-center">
        <VideoProgress />
        <VideoProgressSlider className="absolute" />
      </div>
      <div className="flex items-center gap-2 px-10 py-2">
        <PlayPauseBtn className="h-10" />
        <Timer />
        <div className="group/volume-controls flex items-center justify-between gap-1">
          <VolumeButton className="peer h-10" />
          <div
            className={mergeCls(
              'relative flex',
              'h-max w-0',
              'transition-[width]',
              'group-hover/volume-controls:w-20 group-focus/volume-controls:w-20',
              'peer-focus:w-20 has-[:focus]:w-20'
            )}
          >
            <VolumeProgress />
            <VolumeSlider
              className={mergeCls(
                'opacity-0 focus:opacity-100',
                'group-hover/volume-controls:opacity-100',
                'group-focus/volume-controls:opacity-100',
                'group-has-[.peer:focus]/volume-controls:opacity-100'
              )}
            />
          </div>
        </div>
        <FullScreenButton className="ml-auto" />
      </div>
    </div>
  );
}
