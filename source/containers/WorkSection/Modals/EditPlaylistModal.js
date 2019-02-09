import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

class EditPlaylistModal extends Component {
  static propTypes = {
    changePlaylistVideos: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    modalType: PropTypes.string.isRequired,
    numPlaylistVids: PropTypes.number.isRequired,
    onHide: PropTypes.func.isRequired,
    playlistId: PropTypes.number.isRequired
  };

  timer = null;

  state = {
    addedVideos: [],
    loadingMore: false,
    modalVideos: [],
    searchedVideos: [],
    originalPlaylistVideos: [],
    videosToRemove: [],
    isLoading: false,
    isSaving: false,
    removedVideoIds: {},
    loadMoreButton: false,
    removeVideosLoadMoreButton: false,
    searchLoadMoreButton: false,
    mainTabActive: true,
    searchText: ''
  };

  async componentDidMount() {
    const { modalType, playlistId } = this.props;
    this.setState({ isLoading: true });
    const { results: modalVideos, loadMoreButton } =
      modalType === 'change'
        ? await loadUploads({ type: 'video', limit: 18 })
        : await loadPlaylistVideos({
            playlistId,
            limit: 18
          });
    let originalPlaylistVideos = [];
    if (modalType === 'change') {
      const { results } = await loadPlaylistVideos({
        playlistId,
        targetVideos: modalVideos
      });
      originalPlaylistVideos = results;
    } else {
      originalPlaylistVideos = modalVideos;
    }
    this.setState({
      originalPlaylistVideos,
      modalVideos,
      loadMoreButton,
      isLoading: false
    });
  }

  render() {
    const { modalType, numPlaylistVids, onHide } = this.props;
    const {
      isLoading,
      isSaving,
      addedVideos,
      loadingMore,
      originalPlaylistVideos,
      mainTabActive,
      searchText,
      loadMoreButton,
      removedVideoIds,
      removeVideosLoadMoreButton,
      searchLoadMoreButton,
      searchedVideos,
      modalVideos,
      videosToRemove
    } = this.state;
    const selectedVideos = addedVideos.concat(
      originalPlaylistVideos.filter(video => !removedVideoIds[video.id])
    );
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
          <FilterBar style={{ marginBottom: '2rem', fontWeight: 'bold' }}>
            <nav
              className={mainTabActive ? 'active' : ''}
              onClick={() =>
                this.setState({ mainTabActive: true, loadingMore: false })
              }
              style={{ cursor: 'pointer' }}
            >
              {modalType === 'change' ? 'Add Videos' : 'Reorder Videos'}
            </nav>
            <nav
              className={mainTabActive ? '' : 'active'}
              onClick={this.openRemoveVideosTab}
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
              onChange={this.onVideoSearchInput}
            />
          )}
          {isLoading ? (
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
                  onSelect={video =>
                    this.setState(state => ({
                      addedVideos: [video].concat(state.addedVideos)
                    }))
                  }
                  onDeselect={videoId =>
                    this.setState(state => ({
                      addedVideos: state.addedVideos.filter(
                        video => video.id !== videoId
                      ),
                      removedVideoIds: {
                        ...state.removedVideoIds,
                        [videoId]: true
                      }
                    }))
                  }
                  loadMoreUploads={this.loadMoreVideos}
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
                        const sourceIndex = selectedVideoArray.indexOf(
                          sourceId
                        );
                        const sourceVideo = selected[sourceIndex];
                        const targetIndex = selectedVideoArray.indexOf(
                          targetId
                        );
                        selected.splice(sourceIndex, 1);
                        selected.splice(targetIndex, 0, sourceVideo);
                        this.setState({
                          modalVideos: selected
                        });
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
                        onClick={this.loadMoreVideos}
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
                  onSelect={video =>
                    this.setState(state => ({
                      addedVideos: [video].concat(state.addedVideos),
                      modalVideos: [video].concat(
                        state.modalVideos.filter(
                          modalVideo => modalVideo.id !== video.id
                        )
                      )
                    }))
                  }
                  onDeselect={videoId =>
                    this.setState(state => ({
                      addedVideos: state.addedVideos.filter(
                        video => video.id !== videoId
                      ),
                      removedVideoIds: {
                        ...state.removedVideoIds,
                        [videoId]: true
                      }
                    }))
                  }
                  loadMoreUploads={this.loadMoreVideos}
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
            primary
            onClick={this.handleSave}
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
  }

  handleSave = async() => {
    const {
      addedVideos,
      modalVideos,
      originalPlaylistVideos,
      removedVideoIds
    } = this.state;
    const {
      dispatch,
      modalType,
      onHide,
      playlistId,
      changePlaylistVideos
    } = this.props;
    this.setState({ isSaving: true });
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
            originalVideoIds: originalPlaylistVideos.map(video => video.id),
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
  };

  loadMoreVideos = async() => {
    const { mainTabActive, originalPlaylistVideos, searchText } = this.state;
    const { modalType, playlistId } = this.props;
    this.setState({ loadingMore: true });
    if (!mainTabActive) {
      const { videosToRemove } = this.state;
      const { results: videos, loadMoreButton } = await loadPlaylistVideos({
        playlistId,
        limit: 18,
        shownVideos: videosToRemove
      });
      for (let video of videos) {
        if (
          originalPlaylistVideos.map(video => video.id).indexOf(video.id) === -1
        ) {
          originalPlaylistVideos.push(video);
        }
      }
      return this.setState(state => ({
        loadingMore: false,
        videosToRemove: state.videosToRemove.concat(videos),
        removeVideosLoadMoreButton: loadMoreButton,
        loadMoreButton:
          modalType === 'change'
            ? state.loadMoreButton
            : state.loadMoreButton && loadMoreButton
      }));
    }

    if (!stringIsEmpty(searchText)) {
      const { searchedVideos } = this.state;
      const { results, loadMoreButton } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedVideos
      });
      const { results: playlistVideos } = await loadPlaylistVideos({
        playlistId,
        targetVideos: results
      });
      return this.setState(state => ({
        loadingMore: false,
        searchedVideos: state.searchedVideos.concat(results),
        searchLoadMoreButton: loadMoreButton,
        originalPlaylistVideos: state.originalPlaylistVideos.concat(
          playlistVideos.filter(
            video =>
              state.originalPlaylistVideos
                .map(video => video.id)
                .indexOf(video.id) === -1
          )
        )
      }));
    }

    if (modalType === 'change') {
      const { modalVideos } = this.state;
      const { results: videos, loadMoreButton } = await loadUploads({
        type: 'video',
        limit: 18,
        contentId: modalVideos[modalVideos.length - 1].id
      });
      const { results: playlistVideos } = await loadPlaylistVideos({
        playlistId,
        targetVideos: videos
      });
      return this.setState(state => ({
        loadingMore: false,
        modalVideos: state.modalVideos.concat(
          videos.filter(
            video =>
              state.modalVideos
                .map(modalVideo => modalVideo.id)
                .indexOf(video.id) === -1
          )
        ),
        originalPlaylistVideos: state.originalPlaylistVideos.concat(
          playlistVideos
        ),
        loadMoreButton
      }));
    }

    const { results: videos, loadMoreButton } = await loadPlaylistVideos({
      playlistId,
      shownVideos: originalPlaylistVideos
    });
    this.setState(state => ({
      originalPlaylistVideos: state.originalPlaylistVideos.concat(videos),
      modalVideos: state.modalVideos.concat(
        videos.filter(
          video =>
            state.modalVideos
              .map(modalVideo => modalVideo.id)
              .indexOf(video.id) === -1
        )
      ),
      loadingMore: false,
      loadMoreButton
    }));
  };

  onVideoSearchInput = text => {
    clearTimeout(this.timer);
    this.setState({ searchText: text });
    this.timer = setTimeout(() => this.searchVideo(text), 300);
  };

  openRemoveVideosTab = async() => {
    const { originalPlaylistVideos, videosToRemove } = this.state;
    const { playlistId } = this.props;
    if (videosToRemove.length > 0) {
      return this.setState({
        mainTabActive: false,
        loadingMore: false
      });
    }
    this.setState({
      loadingMore: false,
      mainTabActive: false,
      isLoading: true
    });
    const { results: videos, loadMoreButton } = await loadPlaylistVideos({
      playlistId,
      limit: 18
    });
    for (let video of videos) {
      if (
        originalPlaylistVideos.map(video => video.id).indexOf(video.id) === -1
      ) {
        originalPlaylistVideos.push(video);
      }
    }
    this.setState({
      videosToRemove: videos,
      removeVideosLoadMoreButton: loadMoreButton,
      isLoading: false
    });
  };

  searchVideo = async text => {
    const { playlistId } = this.props;
    const { results: searchedVideos, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    const { results: playlistVideos } = await loadPlaylistVideos({
      playlistId,
      targetVideos: searchedVideos
    });
    this.setState(state => ({
      searchedVideos,
      searchLoadMoreButton: loadMoreButton,
      originalPlaylistVideos: state.originalPlaylistVideos.concat(
        playlistVideos.filter(
          video =>
            state.originalPlaylistVideos
              .map(video => video.id)
              .indexOf(video.id) === -1
        )
      )
    }));
  };
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    changePlaylistVideos: params => dispatch(changePlaylistVideos(params))
  })
)(DragDropContext(HTML5Backend)(EditPlaylistModal));
