import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { connect } from 'react-redux';
import { changePlaylistVideos } from 'redux/actions/PlaylistActions';
import Loading from 'components/Loading';
import SelectVideosForm from './SelectVideosForm';
import SortableThumb from './SortableThumb';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-touch-backend';
import request from 'axios';
import { URL } from 'constants/URL';
import FilterBar from 'components/FilterBar';
import SearchInput from 'components/Texts/SearchInput';
import { queryStringForArray, stringIsEmpty } from 'helpers/stringHelpers';
import { loadVideos, searchContent } from 'helpers/requestHelpers';

class EditPlaylistModal extends Component {
  static propTypes = {
    changePlaylistVideos: PropTypes.func.isRequired,
    modalType: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    playlistId: PropTypes.number.isRequired
  };

  timer = null;

  state = {
    allVideos: [],
    loaded: false,
    isSaving: false,
    searchedVideos: [],
    selectedVideos: [],
    loadMoreButton: false,
    searchLoadMoreButton: false,
    mainTabActive: true,
    searchText: ''
  };

  async componentDidMount() {
    const { modalType, playlistId } = this.props;
    const {
      data: { videos: selectedVideos }
    } = await request.get(
      `${URL}/playlist/playlist?noLimit=1&playlistId=${playlistId}`
    );
    const { videos, loadMoreButton } =
      modalType === 'change' ? await loadVideos({ limit: 18 }) : {};
    this.setState({
      selectedVideos,
      allVideos: videos,
      loadMoreButton,
      loaded: true
    });
  }

  render() {
    const { modalType, onHide } = this.props;
    const {
      isSaving,
      selectedVideos,
      mainTabActive,
      searchText,
      loaded,
      loadMoreButton,
      searchLoadMoreButton,
      searchedVideos,
      allVideos
    } = this.state;
    return (
      <Modal large onHide={onHide}>
        <header>
          {modalType === 'change' ? 'Change Playlist Videos' : 'Reorder Videos'}
        </header>
        <main>
          <FilterBar style={{ marginBottom: '2rem', fontWeight: 'bold' }}>
            <nav
              className={mainTabActive ? 'active' : ''}
              onClick={() => this.setState({ mainTabActive: true })}
              style={{ cursor: 'pointer' }}
            >
              {modalType === 'change' ? 'Add Videos' : 'Reorder Videos'}
            </nav>
            <nav
              className={mainTabActive ? '' : 'active'}
              onClick={() => this.setState({ mainTabActive: false })}
              style={{ cursor: 'pointer' }}
            >
              Remove Videos
            </nav>
          </FilterBar>
          {mainTabActive &&
            modalType === 'change' && (
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
          {!loaded && <Loading />}
          {mainTabActive &&
            modalType === 'change' && (
              <SelectVideosForm
                videos={!stringIsEmpty(searchText) ? searchedVideos : allVideos}
                selectedVideos={selectedVideos}
                loadMoreVideosButton={
                  !stringIsEmpty(searchText)
                    ? searchLoadMoreButton
                    : loadMoreButton
                }
                onSelect={(selected, video) =>
                  this.setState({ selectedVideos: [video].concat(selected) })
                }
                onDeselect={selected =>
                  this.setState({ selectedVideos: selected })
                }
                loadMoreVideos={this.loadMoreVideos}
              />
            )}
          {mainTabActive &&
            modalType === 'reorder' && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                {selectedVideos.map(video => (
                  <SortableThumb
                    key={video.id}
                    video={video}
                    onMove={({ sourceId, targetId }) => {
                      let selected = [...selectedVideos];
                      const selectedVideoArray = selected.map(
                        video => video.id
                      );
                      const sourceIndex = selectedVideoArray.indexOf(sourceId);
                      const sourceVideo = selected[sourceIndex];
                      const targetIndex = selectedVideoArray.indexOf(targetId);
                      selected.splice(sourceIndex, 1);
                      selected.splice(targetIndex, 0, sourceVideo);
                      this.setState({
                        selectedVideos: selected
                      });
                    }}
                  />
                ))}
              </div>
            )}
          {!mainTabActive && (
            <SelectVideosForm
              videos={selectedVideos}
              selectedVideos={selectedVideos}
              onSelect={(selected, video) =>
                this.setState({ selectedVideos: selected.concat([video]) })
              }
              onDeselect={selected =>
                this.setState({ selectedVideos: selected })
              }
            />
          )}
        </main>
        <footer>
          <Button
            primary
            onClick={this.handleSave}
            disabled={selectedVideos.length < 2 || isSaving}
          >
            Save
          </Button>
          <Button style={{ marginRight: '1rem' }} transparent onClick={onHide}>
            Cancel
          </Button>
        </footer>
      </Modal>
    );
  }

  handleSave = async() => {
    const { selectedVideos } = this.state;
    const { onHide, playlistId, changePlaylistVideos } = this.props;
    this.setState({ isSaving: true });
    await changePlaylistVideos({
      playlistId,
      selectedVideos: selectedVideos.map(video => video.id)
    });
    onHide();
  };

  loadMoreVideos = async() => {
    const { allVideos, searchedVideos, searchText } = this.state;
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: queryStringForArray(searchedVideos, 'id', 'shownResults')
      });
      this.setState(state => ({
        searchedVideos: state.searchedVideos.concat(results),
        searchLoadMoreButton: loadMoreButton
      }));
    } else {
      const { videos, loadMoreButton } = await loadVideos({
        limit: 18,
        videoId: allVideos[allVideos.length - 1].id
      });
      this.setState(state => ({
        allVideos: state.allVideos.concat(videos),
        loadMoreButton
      }));
    }
  };

  onVideoSearchInput = text => {
    clearTimeout(this.timer);
    this.setState({ searchText: text });
    this.timer = setTimeout(() => this.searchVideo(text), 300);
  };

  searchVideo = async text => {
    const { results: searchedVideos, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    this.setState({ searchedVideos, searchLoadMoreButton: loadMoreButton });
  };
}

export default connect(
  null,
  {
    changePlaylistVideos
  }
)(DragDropContext(HTML5Backend)(EditPlaylistModal));
