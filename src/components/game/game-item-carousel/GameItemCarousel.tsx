import React from 'react';
import Image from 'next/image';
import { FVideoFullInfo, OmitGameId } from '@/actions/game/select';
import { GameImages } from '@/database/models';
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
    <div>
      <IntersectionObserverContainer>
        <div className="group relative overflow-hidden">
          <NextPrevControls />
          <IntersectionObserverRoot>
            <ul className="scrollbar-hidden flex snap-x snap-mandatory overflow-scroll">
              {videos.map((video) => {
                return (
                  <VideoContainer key={video.ID}>
                    <VideoScrollItem
                      autoScrollInterval={5000}
                      className="w-full shrink-0 snap-start overflow-hidden rounded"
                    >
                      <Video poster={video.thumbnail}>
                        {getVideoSources(video).map((variant) => {
                          return <source key={variant.ID} src={variant.url} />;
                        })}
                      </Video>
                      <div className="relative">
                        <AudioContainer>
                          <VideoAudio>
                            {getAudioSourcesFromVideo(videos[0]).map((variant) => {
                              return <source key={variant?.ID} src={variant?.url} />;
                            })}
                          </VideoAudio>
                          <MediaControls />
                        </AudioContainer>
                      </div>
                    </VideoScrollItem>
                  </VideoContainer>
                );
              })}
              {images.map((img) => (
                <ScrollItem
                  key={img.ID}
                  autoScrollInterval={5000}
                  className="w-full shrink-0 snap-start overflow-hidden rounded"
                >
                  <div className="relative aspect-video w-full">
                    <Image src={img.url} alt={img.type} fill />
                  </div>
                </ScrollItem>
              ))}
              {images.map((img, index) => (
                <ScrollItem
                  key={img.ID + index}
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
        <IndicatorList videos={videos} images={images} />
      </IntersectionObserverContainer>
    </div>
  );
}
