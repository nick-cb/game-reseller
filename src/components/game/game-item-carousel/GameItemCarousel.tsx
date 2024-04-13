import React from 'react';
import Image from 'next/image';
import { FVideoFullInfo, OmitGameId } from '@/actions/game/select';
import { GameImages } from '@/database/models/model';
import { MediaControls, Video, VideoAudio } from '@/components/media/MediaPrimitive';
import { VideoContainer } from '@/components/media/Video';
import { AudioContainer } from '@/components/media/Audio';
import { getAudioSourcesFromVideo, getVideoSources } from '@/utils';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '../../intersection/IntersectionObserver';
import { ScrollItem, VideoScrollItem } from '../../scroll2/ScrollPrimitive';
import { IndicatorList, NextPrevControls } from '@/components/game/game-item-carousel/Indicators';

type LinearCarouselProps = {
  images: OmitGameId<GameImages>[];
  videos: OmitGameId<FVideoFullInfo>[];
};
export const isVideo = (
  media: OmitGameId<GameImages> | OmitGameId<FVideoFullInfo>
): media is OmitGameId<FVideoFullInfo> => {
  return 'recipes' in media;
};
export const breakpoints = [640, 1536] as const;
export default function GameItemCarousel(props: LinearCarouselProps) {
  const { images = [], videos = [] } = props;
  const shouldShowIndicator = videos.length + images.length > 1;

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
            {images.map((img, index) => (
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
