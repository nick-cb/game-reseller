import React from 'react';
import Image from 'next/image';
import { MediaControls, Video, VideoAudio } from '@/components/media/MediaPrimitive';
import { VideoContainer } from '@/components/media/Video';
import { AudioContainer } from '@/components/media/Audio';
import { getAudioSourcesFromVideo, getVideoSources } from '@/utils';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '../../../intersection/IntersectionObserver';
import { ScrollItem, VideoScrollItem } from '@/components/scroll/ScrollPrimitive';
import {
  IndicatorList,
  NextPrevControls,
} from '@/components/pages/game/game-item-carousel/Indicators';
import { FindBySlugResult } from '@/+actions/games-actions/game-detail-page/queries';

type LinearCarouselProps = {
  images: GameImageGroup;
  videos: FindBySlugResult['videos'];
};
export const isVideo = (media: GameImages | FindVideoItemResult): media is FindVideoItemResult => {
  return 'recipes' in media;
};
export const breakpoints = [640, 1536] as const;
export default function GameItemCarousel(props: LinearCarouselProps) {
  const { images, videos = [] } = props;
  const shouldShowIndicator = videos.length + images.landscapes.length > 1;

  return (
    <IntersectionObserverContainer>
      <div className="group relative overflow-hidden">
        {shouldShowIndicator ? <NextPrevControls /> : null}
        <IntersectionObserverRoot>
          <ul className="scrollbar-hidden flex snap-x snap-mandatory overflow-scroll">
            {videos.map((video, index) => {
              return (
                <VideoContainer key={video.ID}>
                  <AudioContainer>
                    <VideoScrollItem
                      index={index}
                      autoScrollInterval={5000}
                      className="w-full shrink-0 snap-start overflow-hidden rounded"
                    >
                      <div className="relative">
                        <Video poster={video.thumbnail} autoPlay>
                          {getVideoSources(video).map((variant) => {
                            return <source key={variant.ID} src={variant.url} />;
                          })}
                        </Video>
                        <VideoAudio>
                          {getAudioSourcesFromVideo(videos[0]).map((variant) => {
                            return <source key={variant?.ID} src={variant?.url} />;
                          })}
                        </VideoAudio>
                        <MediaControls />
                      </div>
                    </VideoScrollItem>
                  </AudioContainer>
                </VideoContainer>
              );
            })}
            {images.landscapes.map((img, index) => (
              <ScrollItem
                index={index + videos.length}
                key={img.ID}
                autoScrollInterval={5000}
                className="w-full shrink-0 snap-start overflow-hidden rounded"
              >
                <div className="relative aspect-video w-full">
                  <Image src={img.url} alt={img.type} fill />
                </div>
              </ScrollItem>
            ))}
          </ul>
        </IntersectionObserverRoot>
      </div>
      {shouldShowIndicator ? <IndicatorList videos={videos} images={images} /> : null}
    </IntersectionObserverContainer>
  );
}
