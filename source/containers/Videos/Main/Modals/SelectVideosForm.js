import PropTypes from 'prop-types';
import React from 'react';
import VideoThumb from './ModalVideoThumb';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';

SelectVideosForm.propTypes = {
  loadingMore: PropTypes.bool,
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
  loadingMore,
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
            onSelect={video => onSelect(video)}
            onDeselect={videoId => onDeselect(videoId)}
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
          <LoadMoreButton
            style={{ fontSize: '2rem', marginTop: '1rem' }}
            transparent
            loading={loadingMore}
            onClick={loadMoreVideos}
          >
            Load More
          </LoadMoreButton>
        </div>
      )}
    </div>
  );
}
