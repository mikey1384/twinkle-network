import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import VideoThumb from 'components/VideoThumb';
import { connect } from 'react-redux';
import { getMoreVideos } from 'redux/actions/VideoActions';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import { last } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { loadUploads, searchContent } from 'helpers/requestHelpers';

AllVideosPanel.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  getMoreVideos: PropTypes.func.isRequired,
  innerRef: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  onAddVideoClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.number,
  videos: PropTypes.array.isRequired
};

function AllVideosPanel({
  authLevel,
  canDelete,
  canEdit,
  getMoreVideos,
  innerRef,
  loadMoreButton,
  loaded,
  onAddVideoClick,
  title = 'All Videos',
  videos: allVideos,
  userId
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef(null);
  const videos = searchQuery ? searchedVideos : allVideos;

  return (
    <SectionPanel
      innerRef={innerRef}
      title={title}
      searchPlaceholder="Search videos"
      button={
        <Button
          disabled={!userId}
          snow
          style={{ marginLeft: 'auto' }}
          onClick={() => onAddVideoClick()}
        >
          + Add Video
        </Button>
      }
      emptyMessage="No Videos"
      isEmpty={videos.length === 0}
      loaded={loaded}
      loadMoreButtonShown={
        !isSearching &&
        (stringIsEmpty(searchQuery) ? loadMoreButton : searchLoadMoreButton)
      }
      loadMore={handleLoadMoreVideos}
      onSearch={handleVideoSearch}
      searchQuery={searchQuery}
      isSearching={isSearching}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around'
        }}
      >
        {videos.map((video, index) => {
          return (
            <VideoThumb
              to={`videos/${video.id}`}
              style={{
                width: '22%',
                marginTop: '1rem',
                marginBottom: '1rem'
              }}
              key={video.id}
              arrayIndex={index}
              editable={determineEditable(video)}
              deletable={determineDeletable(video)}
              video={video}
              user={video.uploader}
              lastVideoId={last(videos) ? last(videos).id : 0}
            />
          );
        })}
      </div>
    </SectionPanel>
  );

  function determineDeletable(video) {
    const userIsUploader = video.uploader.id === userId;
    const userCanDeleteThis = canDelete && authLevel > video.uploader.authLevel;
    return userIsUploader || userCanDeleteThis;
  }

  function determineEditable(video) {
    const userIsUploader = video.uploader.id === userId;
    const userCanEditThis = canEdit && authLevel > video.uploader.authLevel;
    return userIsUploader || userCanEditThis;
  }

  async function handleLoadMoreVideos() {
    const lastId = last(allVideos) ? last(allVideos).id : 0;
    const {
      results: loadedVideos,
      loadMoreButton: loadMoreShown
    } = stringIsEmpty(searchQuery)
      ? await loadUploads({
          type: 'video',
          contentId: lastId
        })
      : await searchContent({
          filter: 'video',
          searchText: searchQuery,
          shownResults: searchedVideos
        });
    if (stringIsEmpty(searchQuery)) {
      return getMoreVideos({
        videos: loadedVideos,
        loadMoreButton: loadMoreShown
      });
    }
    setSearchedVideos(searchedVideos.concat(loadedVideos));
    setSearchLoadMoreButton(loadMoreShown);
  }

  function handleVideoSearch(text) {
    clearTimeout(timerRef.current);
    setSearchQuery(text);
    setIsSearching(true);
    timerRef.current = setTimeout(() => searchVideo(text), 300);
  }

  async function searchVideo(text) {
    if (stringIsEmpty(text) || text.length < 3) {
      setSearchedVideos([]);
      setIsSearching(false);
      return;
    }
    const { results, loadMoreButton: loadMoreShown } = await searchContent({
      filter: 'video',
      limit: 12,
      searchText: text
    });
    setSearchedVideos(results);
    setIsSearching(false);
    setSearchLoadMoreButton(loadMoreShown);
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar,
    loaded: state.VideoReducer.loaded,
    loadMoreButton: state.VideoReducer.loadMoreVideosButton,
    videos: state.VideoReducer.allVideoThumbs
  }),
  {
    getMoreVideos
  }
)(withRouter(AllVideosPanel));
