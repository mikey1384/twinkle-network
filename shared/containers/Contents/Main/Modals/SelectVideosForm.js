import React from 'react';
import VideoThumb from './ModalVideoThumb';

export default function SelectVideosForm(props) {
  const {
    videos,
    selectedVideos,
    loadMoreVideosButton,
    onSelect,
    onDeselect,
    loadMoreVideos
  } = props;
  return (
    <div className="row">
      {videos.map((video, index) => {
        return (
          <VideoThumb
            key={index}
            video={video}
            selected={selectedVideos.indexOf(video.id) !== -1}
            onSelect={videoId => {
              let selected = selectedVideos;
              onSelect(selected, videoId);
            }}
            onDeselect={videoId => {
              let selected = selectedVideos;
              const index = selected.indexOf(videoId);
              selected.splice(index, 1);
              onDeselect(selected);
            }}
          />
        )
      })}
      {loadMoreVideosButton &&
        <div className="text-center">
          <button className="btn btn-default" onClick={loadMoreVideos}>Load More</button>
        </div>
      }
    </div>
  )
}
