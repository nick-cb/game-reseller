# Video and audio specifications

## Video events

- `canplay` -	can play the media, but probally cannot play to the end without stopping for buffering
- `canplaythrough` - **Probally** can play the media up to its end without stopping for content buffering.
- `complete` -The rendering of an OfflineAudioContext is terminated.
- `durationchange` - The duration attribute has been updated.
- `emptied` - The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it.
- `ended` -	Playback has stopped because the end of the media was reached.
- `error` -	An error occurred while fetching the media data, or the type of the resource is not a supported media format.
- `loadeddata` - The first frame of the media has finished loading.
- `loadedmetadata` - The metadata has been loaded.
- `loadstart` -	Fired when the browser has started to load the resource.
- `pause` -	Playback has been paused.
- `play` -	Playback has begun.
- `playing` - Playback is ready to start after having been paused or delayed due to lack of data.
- `progress` - Fired periodically as the browser loads a resource.
- `ratechange` - The playback rate has changed.
- `seeked` - A seek operation completed.
- `seeking` - A seek operation began.
- `stalled` - The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
- `suspend` - Media data loading has been suspended.
- `timeupdate` - The time indicated by the currentTime attribute has been updated.
- `volumechange` -	The volume has changed.
- `waiting` - Playback has stopped because of a temporary lack of data.

1. `timeupdate` - The time indicated by the currentTime attribute has been updated.
2. `loadedmetadata` - The metadata has been loaded.
3. `play` -	Playback has begun.
4. `pause` -	Playback has been paused.
5. `seeked` - A seek operation completed.


video play -> audio play
video pause -> audio pause
video seek -> audio seek
video end -> audio end

- In order for video to start playing, it need to be buffered first
    -> Sync the buffering between video and audio
    - The sync need to happen every time:
        - `timeupdate` is fired
        - `play` is fired
        - `pause` is fired
        - `seek` is fired
    - Sync mean:
        - The video must wait for the audio to be done buffering to continue play
        - The audio must wait for the video to be done buffering to continue play
        - The audio must pause when the video is pause
        - The audio must be seeked when the video be seeked
    - In order to get the best sync experience, the audio should be control by the video events instead of it own.
- We should handle autoPlay instead of using browser's default
- If there are no js, then fallback to browser's default
