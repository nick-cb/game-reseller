'use client';

import { DetailedHTMLProps, VideoHTMLAttributes, useContext, useEffect } from 'react';
import { useVideo, VideoCtx } from '../../hooks/useVideo';
import { AudioCtx } from '@/hooks/useAudio';

export function Video(
  props: DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
) {
  const { videoRef } = useContext(VideoCtx);

  return <video ref={videoRef} {...props} />;
}

export function Audio() {
  const { audioRef } = useContext(AudioCtx);
  const { playing, currentTime } = useVideo();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (playing) {
      audio.play();
      audio.muted = false;
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.currentTime = currentTime;
  }, [currentTime]);

  return (
    <audio
      ref={audioRef}
      muted
      controls
      preload="auto"
      autoPlay
      src="https://media-cdn.epicgames.com/e64f5e146efb40bb916a40fbf09761e1/e64f5e146efb40bb916a40fbf09761e1-audio.webm"
    />
  );
}

export function PlayButton() {
  const { playing, play, pause } = useVideo({
    events: ['play', 'pause', 'volumechange', 'seek'],
  });
  return (
    <button onClick={playing ? pause : play}>
      {playing ? (
        <svg width={24} height={24} fill="white">
          <use xlinkHref="/svg/remixicon.media.svg#ri-pause-fill" />
        </svg>
      ) : (
        <svg width={24} height={24} fill="white">
          <use xlinkHref="/svg/remixicon.media.svg#ri-play-fill" />
        </svg>
      )}
    </button>
  );
}
