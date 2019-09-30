import React, { useEffect, useRef, useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import SortableThumb from 'components/SortableThumb';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import FilterBar from 'components/FilterBar';
import SearchInput from 'components/Texts/SearchInput';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { isMobile, objectify } from 'helpers';
import { useAppContext } from 'contexts';

EditPlaylistModal.propTypes = {
  modalType: PropTypes.string.isRequired,
  numPlaylistVids: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  playlistId: PropTypes.number.isRequired
};

const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;

export default function EditPlaylistModal({
  modalType,
  numPlaylistVids,
  onHide,
  playlistId
}) {
  const {
    explore: {
      actions: { onChangePlaylistVideos }
    },
    requestHelpers: {
      editPlaylistVideos,
      loadPlaylistVideos,
      loadUploads,
      reorderPlaylistVideos,
      searchContent
    }
  } = useAppContext();
  const [addedVideos, setAddedVideos] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalVideos, setModalVideos] = useState([]);
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [loadedOrSearchedVideos, setLoadedOrSearchedVideos] = useState([]);
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
  const playlistVideoObjects = useRef({});
  const initialSelectedVideos = useRef([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setIsLoading(true);
    init();
    async function init() {
      const { results: modalVids, loadMoreButton: loadMoreShown } =
        modalType === 'change'
          ? await loadUploads({ contentType: 'video', limit: 18 })
          : await loadPlaylistVideos({
              playlistId,
              limit: 18
            });
      playlistVideoObjects.current = objectify(modalVids);
      if (modalType === 'change') {
        const { results } = await loadPlaylistVideos({
          playlistId,
          targetVideos: modalVids
        });
        initialSelectedVideos.current = results.map(video => video.id);
      } else {
        initialSelectedVideos.current = modalVids.map(video => video.id);
      }
      setModalVideos(modalVids.map(video => video.id));
      setSelectedVideos(initialSelectedVideos.current);
      setLoadMoreButton(loadMoreShown);
      setIsLoading(false);
    }
  }, []);

  const videosToRearrange = modalVideos.filter(
    videoId => !removedVideoIds[videoId] || addedVideos.includes(videoId)
  );

  return (
    <ErrorBoundary>
      <DndProvider backend={Backend}>
        <Modal large onHide={onHide}>
          <header>
            {modalType === 'change'
              ? 'Change Playlist Videos'
              : 'Reorder Videos'}
          </header>
          <main>
            <FilterBar style={{ marginBottom: '2rem', fontWeight: 'bold' }}>
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
                    contentObjs={playlistVideoObjects.current}
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
                    onSelect={selectedVideoId => {
                      setAddedVideos(addedVideos =>
                        [selectedVideoId].concat(addedVideos)
                      );
                      setSelectedVideos(selectedVideos =>
                        [selectedVideoId].concat(selectedVideos)
                      );
                      setLoadedOrSearchedVideos(loadedOrSearchedVideo =>
                        [selectedVideoId].concat(
                          loadedOrSearchedVideo.filter(
                            videoId => videoId !== selectedVideoId
                          )
                        )
                      );
                      if (!stringIsEmpty(searchText)) {
                        setModalVideos(modalVideos =>
                          [selectedVideoId].concat(
                            modalVideos.filter(
                              videoId => videoId !== selectedVideoId
                            )
                          )
                        );
                      }
                    }}
                    onDeselect={deselectedId => {
                      setAddedVideos(addedVideos =>
                        addedVideos.filter(videoId => videoId !== deselectedId)
                      );
                      setSelectedVideos(selectedVideos =>
                        selectedVideos.filter(
                          videoId => videoId !== deselectedId
                        )
                      );
                      setRemovedVideoIds(removedVideoIds => ({
                        ...removedVideoIds,
                        [deselectedId]: true
                      }));
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
                    {videosToRearrange.map(videoId => (
                      <SortableThumb
                        key={videoId}
                        id={videoId}
                        video={playlistVideoObjects.current[videoId]}
                        onMove={({ sourceId, targetId }) => {
                          let selected = [...videosToRearrange];
                          const sourceIndex = selected.indexOf(sourceId);
                          const targetIndex = selected.indexOf(targetId);
                          selected.splice(sourceIndex, 1);
                          selected.splice(targetIndex, 0, sourceId);
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
                    contentObjs={playlistVideoObjects.current}
                    loadingMore={loadingMore}
                    uploads={loadedOrSearchedVideos}
                    loadMoreButton={removeVideosLoadMoreButton}
                    selectedUploads={selectedVideos}
                    onSelect={selectedVideoId => {
                      setAddedVideos(addedVideos =>
                        [selectedVideoId].concat(addedVideos)
                      );
                      setSelectedVideos(selectedVideos =>
                        [selectedVideoId].concat(selectedVideos)
                      );
                      setModalVideos(modalVideos =>
                        [selectedVideoId].concat(
                          modalVideos.filter(
                            modalVideoId => modalVideoId !== selectedVideoId
                          )
                        )
                      );
                    }}
                    onDeselect={deselectedId => {
                      setAddedVideos(addedVideos =>
                        addedVideos.filter(videoId => videoId !== deselectedId)
                      );
                      setSelectedVideos(selectedVideos =>
                        selectedVideos.filter(
                          videoId => videoId !== deselectedId
                        )
                      );
                      setRemovedVideoIds(removedVideoIds => ({
                        ...removedVideoIds,
                        [deselectedId]: true
                      }));
                    }}
                    loadMoreUploads={handleLoadMoreVideos}
                  />
                )}
              </>
            )}
          </main>
          <footer>
            <Button
              style={{ marginRight: '0.7rem' }}
              transparent
              onClick={onHide}
            >
              Cancel
            </Button>
            <Button
              color="blue"
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
      </DndProvider>
    </ErrorBoundary>
  );

  async function handleSave() {
    setIsSaving(true);
    const playlist =
      modalType === 'change'
        ? await editPlaylistVideos({
            addedVideoIds: addedVideos,
            removedVideoIds,
            playlistId
          })
        : await reorderPlaylistVideos({
            originalVideoIds: initialSelectedVideos.current,
            reorderedVideoIds: modalVideos.filter(
              videoId =>
                !removedVideoIds[videoId] || addedVideos.includes(videoId)
            ),
            playlistId
          });
    onChangePlaylistVideos(playlist);
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
        shownVideos: loadedOrSearchedVideos.map(
          videoId => playlistVideoObjects.current[videoId]
        )
      });
      playlistVideoObjects.current = {
        ...playlistVideoObjects.current,
        ...objectify(loadedVideos)
      };
      for (let video of loadedVideos) {
        initialSelectedVideos.current = initialSelectedVideos.current
          .filter(videoId => videoId !== video.id)
          .concat(video.id);
        if (!selectedVideos.includes(video.id) && !removedVideoIds[video.id]) {
          setSelectedVideos(selectedVideos => selectedVideos.concat(video.id));
        }
      }
      setLoadedOrSearchedVideos(loadedOrSearchedVideos =>
        loadedOrSearchedVideos.concat(
          loadedVideos
            .map(video => video.id)
            .filter(videoId => !loadedOrSearchedVideos.includes(videoId))
        )
      );
      setRemoveVideosLoadMoreButton(removeVidsLoadMoreButton);
      setLoadingMore(false);
      return;
    }

    if (!stringIsEmpty(searchText)) {
      const {
        results: loadedVideos,
        loadMoreButton: searchContentLoadMoreButton
      } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedVideos.map(
          videoId => playlistVideoObjects.current[videoId]
        )
      });
      const { results: playlistVideos } = await loadPlaylistVideos({
        playlistId,
        targetVideos: loadedVideos
      });
      playlistVideoObjects.current = {
        ...playlistVideoObjects.current,
        ...objectify(loadedVideos)
      };
      setSearchedVideos(searchedVideos =>
        searchedVideos.concat(loadedVideos.map(video => video.id))
      );
      setSelectedVideos(selectedVideos =>
        selectedVideos.concat(
          playlistVideos
            .map(video => video.id)
            .filter(
              videoId =>
                !selectedVideos.includes(videoId) && !removedVideoIds[videoId]
            )
        )
      );
      setLoadingMore(false);
      setSearchLoadMoreButton(searchContentLoadMoreButton);
      return;
    }

    if (modalType === 'change') {
      const {
        results: loadedVideos,
        loadMoreButton: changeLoadMoreButton
      } = await loadUploads({
        contentType: 'video',
        limit: 18,
        contentId: modalVideos[modalVideos.length - 1]
      });
      const { results: playlistVideos } = await loadPlaylistVideos({
        playlistId,
        targetVideos: loadedVideos
      });
      playlistVideoObjects.current = {
        ...playlistVideoObjects.current,
        ...objectify(loadedVideos)
      };
      setModalVideos(
        modalVideos.concat(
          loadedVideos
            .map(video => video.id)
            .filter(videoId => !modalVideos.includes(videoId))
        )
      );
      setSelectedVideos(selectedVideos =>
        selectedVideos.concat(
          playlistVideos
            .map(video => video.id)
            .filter(
              videoId =>
                !selectedVideos.includes(videoId) && !removedVideoIds[videoId]
            )
        )
      );
      setLoadingMore(false);
      setLoadMoreButton(changeLoadMoreButton);
      return;
    }

    const {
      results: loadedVideos,
      loadMoreButton: reorderLoadMoreButton
    } = await loadPlaylistVideos({
      playlistId,
      shownVideos: modalVideos.map(
        videoId => playlistVideoObjects.current[videoId]
      ),
      limit: 18
    });
    playlistVideoObjects.current = {
      ...playlistVideoObjects.current,
      ...objectify(loadedVideos)
    };
    for (let video of loadedVideos) {
      initialSelectedVideos.current = initialSelectedVideos.current
        .filter(videoId => videoId !== video.id)
        .concat(video.id);
      if (!removedVideoIds[video.id]) {
        setSelectedVideos(selectedVideos =>
          selectedVideos
            .filter(videoId => videoId !== video.id)
            .concat(video.id)
        );
      }
    }
    setModalVideos(
      modalVideos.concat(
        loadedVideos
          .map(video => video.id)
          .filter(videoId => !modalVideos.includes(videoId))
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
    const { results: loadedVideos, loadMoreButton } = await loadPlaylistVideos({
      playlistId,
      limit: 18
    });
    playlistVideoObjects.current = {
      ...playlistVideoObjects.current,
      ...objectify(loadedVideos)
    };
    for (let video of loadedVideos) {
      if (!selectedVideos.includes(video.id) && !removedVideoIds[video.id]) {
        setSelectedVideos(selectedVideos => selectedVideos.concat(video.id));
      }
    }
    setLoadedOrSearchedVideos(loadedOrSearchedVideos =>
      loadedOrSearchedVideos.concat(
        loadedVideos
          .map(video => video.id)
          .filter(videoId => !loadedOrSearchedVideos.includes(videoId))
      )
    );
    setRemoveVideosLoadMoreButton(loadMoreButton);
    setIsLoading(false);
  }

  async function handleSearchVideo(text) {
    const { results: searchResults, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    const { results: playlistVideos } = await loadPlaylistVideos({
      playlistId,
      targetVideos: searchResults
    });
    playlistVideoObjects.current = {
      ...playlistVideoObjects.current,
      ...objectify(searchResults)
    };
    setSearchedVideos(searchResults.map(video => video.id));
    setSearchLoadMoreButton(loadMoreButton);
    setSelectedVideos(selectedVideos =>
      selectedVideos.concat(
        playlistVideos
          .map(video => video.id)
          .filter(id => !selectedVideos.includes(id))
      )
    );
    setIsLoading(false);
  }
}
