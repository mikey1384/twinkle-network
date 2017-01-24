import React from 'react';
import VideoThumb from './ModalVideoThumb';
import Button from 'components/Button';

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
          <Button className="btn btn-success" onClick={loadMoreVideos}>Load More</Button>
        </div>
      }
    </div>
  )
}
