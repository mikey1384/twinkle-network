import React, { useEffect, useRef, useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { connect } from 'react-redux';
import { changePlaylistVideos } from 'redux/actions/VideoActions';
import Loading from 'components/Loading';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import SortableThumb from 'components/SortableThumb';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-touch-backend';
import FilterBar from 'components/FilterBar';
import SearchInput from 'components/Texts/SearchInput';
import { stringIsEmpty } from 'helpers/stringHelpers';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import {
  editPlaylistVideos,
  loadUploads,
  loadPlaylistVideos,
  reorderPlaylistVideos,
  searchContent
} from 'helpers/requestHelpers';

EditPlaylistModal.propTypes = {
  changePlaylistVideos: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  modalType: PropTypes.string.isRequired,
  numPlaylistVids: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  playlistId: PropTypes.number.isRequired,
  profileTheme: PropTypes.string
};

function EditPlaylistModal({
  changePlaylistVideos,
  dispatch,
  modalType,
  numPlaylistVids,
  onHide,
  playlistId,
  profileTheme
}) {
  const [addedVideos, setAddedVideos] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalVideos, setModalVideos] = useState([]);
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [videosToRemove, setVideosToRemove] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [removedVideoIds, setRemovedVideoIds] = useState({});
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [removeVideosLoadMoreButton, setRemoveVideosLoadMoreButton] = useState(
    false
  );
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [mainTabActive, setMainTabActive] = useState(true);
  const [openedRemoveVideosTab, setOpenedRemoveVideosTab] = useState(false);
  const { handleSearch, searching, searchText } = useSearch({
    onSearch: handleSearchVideo,
    onClear: () => setSearchedVideos([])
  });
  const originalPlaylistVideos = useRef([]);
  const mounted = useRef(true);
  const themeColor = profileTheme || 'logoBlue';

  useEffect(() => {
    mounted.current = true;
    setIsLoading(true);
    init();
    async function init() {
      const { results: modalVids, loadMoreButton: loadMoreShown } =
        modalType === 'change'
          ? await loadUploads({ type: 'video', limit: 18 })
          : await loadPlaylistVideos({
              playlistId,
              limit: 18
            });
      if (modalType === 'change') {
        const { results } = await loadPlaylistVideos({
          playlistId,
          targetVideos: modalVids
        });
        originalPlaylistVideos.current = results;
      } else {
        originalPlaylistVideos.current = modalVids;
      }
      setModalVideos(modalVids);
      setLoadMoreButton(loadMoreShown);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedVideos(
      addedVideos.concat(
        originalPlaylistVideos.current.filter(
          video => !removedVideoIds[video.id]
        )
      )
    );
  }, [
    originalPlaylistVideos.current,
    addedVideos,
    removedVideoIds,
    videosToRemove
  ]);

  const videosToRearrange = modalVideos.filter(
    video =>
      !removedVideoIds[video.id] ||
      addedVideos.map(video => video.id).indexOf(video.id) !== -1
  );
  return (
    <Modal large onHide={onHide}>
      <header>
        {modalType === 'change' ? 'Change Playlist Videos' : 'Reorder Videos'}
      </header>
      <main>
        <FilterBar
          color={themeColor}
          style={{ marginBottom: '2rem', fontWeight: 'bold' }}
        >
          <nav
            className={mainTabActive ? 'active' : ''}
            onClick={() => {
              setMainTabActive(true);
              setLoadingMore(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            {modalType === 'change' ? 'Add Videos' : 'Reorder Videos'}
          </nav>
          <nav
            className={mainTabActive ? '' : 'active'}
            onClick={openRemoveVideosTab}
            style={{ cursor: 'pointer' }}
          >
            Remove Videos
          </nav>
        </FilterBar>
        {mainTabActive && modalType === 'change' && (
          <SearchInput
            placeholder="Search videos..."
            autoFocus
            style={{
              marginBottom: '2rem',
              width: '70%'
            }}
            value={searchText}
            onChange={handleSearch}
          />
        )}
        {isLoading || searching ? (
          <Loading />
        ) : (
          <>
            {mainTabActive && modalType === 'change' && (
              <SelectUploadsForm
                loadingMore={loadingMore}
                uploads={
                  !stringIsEmpty(searchText) ? searchedVideos : modalVideos
                }
                selectedUploads={selectedVideos}
                loadMoreButton={
                  !stringIsEmpty(searchText)
                    ? searchLoadMoreButton
                    : loadMoreButton
                }
                onSelect={video => {
                  setAddedVideos([video].concat(addedVideos));
                  if (!stringIsEmpty(searchText)) {
                    setVideosToRemove(
                      [video].concat(
                        videosToRemove.filter(
                          videoToRemove => videoToRemove.id !== video.id
                        )
                      )
                    );
                    setModalVideos(
                      [video].concat(
                        modalVideos.filter(
                          modalVideo => modalVideo.id !== video.id
                        )
                      )
                    );
                  }
                }}
                onDeselect={videoId => {
                  setAddedVideos(
                    addedVideos.filter(video => video.id !== videoId)
                  );
                  setRemovedVideoIds({
                    ...removedVideoIds,
                    [videoId]: true
                  });
                }}
                loadMoreUploads={handleLoadMoreVideos}
              />
            )}
            {mainTabActive && modalType === 'reorder' && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                {videosToRearrange.map(video => (
                  <SortableThumb
                    key={video.id}
                    video={video}
                    onMove={({ sourceId, targetId }) => {
                      let selected = [...videosToRearrange];
                      const selectedVideoArray = selected.map(
                        video => video.id
                      );
                      const sourceIndex = selectedVideoArray.indexOf(sourceId);
                      const sourceVideo = selected[sourceIndex];
                      const targetIndex = selectedVideoArray.indexOf(targetId);
                      selected.splice(sourceIndex, 1);
                      selected.splice(targetIndex, 0, sourceVideo);
                      setModalVideos(selected);
                    }}
                  />
                ))}
                {loadMoreButton && (
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
                      onClick={handleLoadMoreVideos}
                    >
                      Load More
                    </LoadMoreButton>
                  </div>
                )}
              </div>
            )}
            {!mainTabActive && (
              <SelectUploadsForm
                loadingMore={loadingMore}
                uploads={videosToRemove}
                loadMoreButton={removeVideosLoadMoreButton}
                selectedUploads={selectedVideos}
                onSelect={video => {
                  setAddedVideos([video].concat(addedVideos));
                  setModalVideos(
                    [video].concat(
                      modalVideos.filter(
                        modalVideo => modalVideo.id !== video.id
                      )
                    )
                  );
                }}
                onDeselect={videoId => {
                  setAddedVideos(
                    addedVideos.filter(video => video.id !== videoId)
                  );
                  setRemovedVideoIds({
                    ...removedVideoIds,
                    [videoId]: true
                  });
                }}
                loadMoreUploads={handleLoadMoreVideos}
              />
            )}
          </>
        )}
      </main>
      <footer>
        <Button style={{ marginRight: '0.7rem' }} transparent onClick={onHide}>
          Cancel
        </Button>
        <Button
          primary
          onClick={handleSave}
          disabled={
            (Object.keys(removedVideoIds).length === numPlaylistVids &&
              addedVideos.length === 0) ||
            isSaving
          }
        >
          Save
        </Button>
      </footer>
    </Modal>
  );

  async function handleSave() {
    setIsSaving(true);
    const playlist =
      modalType === 'change'
        ? await editPlaylistVideos({
            addedVideoIds: addedVideos.map(video => video.id),
            dispatch,
            removedVideoIds,
            playlistId
          })
        : await reorderPlaylistVideos({
            dispatch,
            originalVideoIds: originalPlaylistVideos.current.map(
              video => video.id
            ),
            reorderedVideoIds: modalVideos
              .filter(
                video =>
                  !removedVideoIds[video.id] ||
                  addedVideos.map(video => video.id).indexOf(video.id) !== -1
              )
              .map(video => video.id),
            playlistId
          });
    await changePlaylistVideos(playlist);
    onHide();
  }

  async function handleLoadMoreVideos() {
    setLoadingMore(true);
    if (!mainTabActive) {
      const {
        results: loadedVideos,
        loadMoreButton: removeVidsLoadMoreButton
      } = await loadPlaylistVideos({
        playlistId,
        limit: 18,
        shownVideos: videosToRemove
      });
      for (let video of loadedVideos) {
        if (
          originalPlaylistVideos.current
            .map(originalVideo => originalVideo.id)
            .indexOf(video.id) === -1
        ) {
          originalPlaylistVideos.current.push(video);
        }
      }
      setLoadingMore(false);
      setVideosToRemove(videosToRemove.concat(loadedVideos));
      setRemoveVideosLoadMoreButton(removeVidsLoadMoreButton);
      if (modalType !== 'change') {
        setLoadMoreButton(loadMoreButton && removeVidsLoadMoreButton);
      }
      return;
    }

    if (!stringIsEmpty(searchText)) {
      const {
        results,
        loadMoreButton: searchContentLoadMoreButton
      } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedVideos
      });
      const { results: playlistVideos } = await loadPlaylistVideos({
        playlistId,
        targetVideos: results
      });
      setLoadingMore(false);
      setSearchedVideos(searchedVideos.concat(results));
      setSearchLoadMoreButton(searchContentLoadMoreButton);
      originalPlaylistVideos.current.push(
        playlistVideos.filter(
          video =>
            originalPlaylistVideos.current
              .map(video => video.id)
              .indexOf(video.id) === -1
        )
      );
      return;
    }

    if (modalType === 'change') {
      const {
        results: videos,
        loadMoreButton: changeLoadMoreButton
      } = await loadUploads({
        type: 'video',
        limit: 18,
        contentId: modalVideos[modalVideos.length - 1].id
      });
      const { results: playlistVideos } = await loadPlaylistVideos({
        playlistId,
        targetVideos: videos
      });
      setLoadingMore(false);
      setModalVideos(
        modalVideos.concat(
          videos.filter(
            video =>
              modalVideos.map(modalVideo => modalVideo.id).indexOf(video.id) ===
              -1
          )
        )
      );
      originalPlaylistVideos.current.push(playlistVideos);
      setLoadMoreButton(changeLoadMoreButton);
      return;
    }

    const {
      results: videos,
      loadMoreButton: reorderLoadMoreButton
    } = await loadPlaylistVideos({
      playlistId,
      shownVideos: originalPlaylistVideos.current,
      limit: 18
    });
    originalPlaylistVideos.current = originalPlaylistVideos.current.concat(
      videos
    );
    setModalVideos(
      modalVideos.concat(
        videos.filter(
          video =>
            modalVideos.map(modalVideo => modalVideo.id).indexOf(video.id) ===
            -1
        )
      )
    );
    setLoadingMore(false);
    setLoadMoreButton(reorderLoadMoreButton);
  }

  async function openRemoveVideosTab() {
    if (openedRemoveVideosTab) {
      setMainTabActive(false);
      setLoadingMore(false);
      return;
    }
    setOpenedRemoveVideosTab(true);
    setLoadingMore(false);
    setMainTabActive(false);
    setIsLoading(true);
    const { results: videos, loadMoreButton } = await loadPlaylistVideos({
      playlistId,
      limit: 18
    });
    for (let video of videos) {
      if (
        originalPlaylistVideos.current
          .map(video => video.id)
          .indexOf(video.id) === -1
      ) {
        originalPlaylistVideos.current.push(video);
      }
    }
    setVideosToRemove(videosToRemove.concat(videos));
    setRemoveVideosLoadMoreButton(loadMoreButton);
    setIsLoading(false);
  }

  async function handleSearchVideo(text) {
    const { results: searchedVideos, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    const { results: playlistVideos } = await loadPlaylistVideos({
      playlistId,
      targetVideos: searchedVideos
    });
    setSearchedVideos(searchedVideos);
    setSearchLoadMoreButton(loadMoreButton);
    originalPlaylistVideos.current.push(
      playlistVideos.filter(
        video =>
          originalPlaylistVideos.current
            .map(video => video.id)
            .indexOf(video.id) === -1
      )
    );
    setIsLoading(false);
  }
}

export default connect(
  state => ({
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({
    dispatch,
    changePlaylistVideos: params => dispatch(changePlaylistVideos(params))
  })
)(DragDropContext(HTML5Backend)(EditPlaylistModal));
