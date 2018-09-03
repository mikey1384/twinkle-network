import PropTypes from 'prop-types';
import React from 'react';
import VideoThumb from './ModalVideoThumb';
import Button from 'components/Button';

SelectVideosForm.propTypes = {
  loadMoreVideos: PropTypes.func,
  loadMoreVideosButton: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onDeselect: PropTypes.func.isRequired,
  selectedVideos: PropTypes.array.isRequired,
  videos: PropTypes.array.isRequired
};
export default function SelectVideosForm({
  videos,
  selectedVideos,
  loadMoreVideosButton,
  onSelect,
  onDeselect,
  loadMoreVideos
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%'
      }}
    >
      {videos.map((video, index) => {
        return (
          <VideoThumb
            key={index}
            video={video}
            selected={
              selectedVideos.map(video => video.id).indexOf(video.id) !== -1
            }
            onSelect={video => onSelect(selectedVideos, video)}
            onDeselect={videoId => {
              let selected = selectedVideos;
              const index = selected.map(video => video.id).indexOf(videoId);
              selected.splice(index, 1);
              onDeselect(selected);
            }}
          />
        );
      })}
      {loadMoreVideosButton && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Button
            style={{ fontSize: '2rem', marginTop: '1rem' }}
            transparent
            onClick={loadMoreVideos}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
