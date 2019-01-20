import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Textarea from 'components/Texts/Textarea';
import Modal from 'components/Modal';
import Button from 'components/Button';
import {
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers';
import SortableThumb from 'components/SortableThumb';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-touch-backend';
import SelectUploadsForm from 'components/Forms/SelectUploadsForm';
import Input from 'components/Texts/Input';
import SearchInput from 'components/Texts/SearchInput';
import {
  loadUploads,
  searchContent,
  uploadPlaylist
} from 'helpers/requestHelpers';
import { css } from 'emotion';
import { connect } from 'react-redux';

class AddPlaylistModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    excludeVideoIds: PropTypes.array,
    onHide: PropTypes.func,
    postPlaylist: PropTypes.func,
    title: PropTypes.string
  };

  timer = null;

  constructor({ title = '' }) {
    super();
    this.state = {
      isUploading: false,
      section: 0,
      title: title?.charAt(0).toUpperCase() + title?.slice(1),
      description: '',
      allVideos: [],
      searchedVideos: [],
      selectedVideos: [],
      loadMoreButton: false,
      searchLoadMoreButton: false,
      searchText: ''
    };
  }

  async componentDidMount() {
    const { excludeVideoIds = [] } = this.props;
    const { results, loadMoreButton } = await loadUploads({
      type: 'video',
      limit: 18,
      excludeContentIds: excludeVideoIds
    });
    this.setState({
      allVideos: results,
      loadMoreButton
    });
  }

  render() {
    const { onHide } = this.props;
    const {
      isUploading,
      section,
      title,
      description,
      loadMoreButton,
      allVideos,
      searchedVideos,
      selectedVideos,
      searchText,
      searchLoadMoreButton
    } = this.state;
    const titleExceedsCharLimit = exceedsCharLimit({
      contentType: 'playlist',
      inputType: 'title',
      text: title
    });
    const descriptionExceedsCharLimit = exceedsCharLimit({
      contentType: 'playlist',
      inputType: 'description',
      text: description
    });
    return (
      <Modal onHide={onHide} large={section > 0}>
        <header>{this.renderTitle()}</header>
        <main style={{ paddingBottom: '1rem' }}>
          {section === 0 && (
            <form
              className={css`
                width: 100%;
              `}
              onSubmit={event => event.preventDefault()}
            >
              <section>
                <Input
                  placeholder="Enter Playlist Title"
                  value={title}
                  onChange={text => this.setState({ title: text })}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({ title: addEmoji(event.target.value) });
                    }
                  }}
                  style={titleExceedsCharLimit}
                />
                {titleExceedsCharLimit && (
                  <small style={{ color: 'red', fontSize: '1.3rem' }}>
                    {renderCharLimit({
                      contentType: 'playlist',
                      inputType: 'title',
                      text: title
                    })}
                  </small>
                )}
              </section>
              <section style={{ marginTop: '1.5rem' }}>
                <Textarea
                  name="description"
                  placeholder="Enter Description (Optional)"
                  minRows={4}
                  value={description}
                  onChange={event =>
                    this.setState({ description: event.target.value })
                  }
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({
                        description: addEmoji(event.target.value)
                      });
                    }
                  }}
                  style={descriptionExceedsCharLimit}
                />
                {descriptionExceedsCharLimit && (
                  <small style={{ color: 'red', fontSize: '1.3rem' }}>
                    {renderCharLimit({
                      contentType: 'playlist',
                      inputType: 'description',
                      text: description
                    })}
                  </small>
                )}
              </section>
            </form>
          )}
          {section === 1 && (
            <div style={{ width: '100%' }}>
              <SearchInput
                placeholder="Search videos..."
                autoFocus
                style={{
                  marginBottom: '2em',
                  width: '50%'
                }}
                value={searchText}
                onChange={this.onVideoSearchInput}
              />
              <SelectUploadsForm
                uploads={
                  !stringIsEmpty(searchText) ? searchedVideos : allVideos
                }
                selectedUploads={selectedVideos}
                loadMoreButton={
                  !stringIsEmpty(searchText)
                    ? searchLoadMoreButton
                    : loadMoreButton
                }
                onSelect={video =>
                  this.setState(state => ({
                    selectedVideos: state.selectedVideos.concat([video])
                  }))
                }
                onDeselect={videoId =>
                  this.setState(state => ({
                    selectedVideos: state.selectedVideos.filter(
                      video => video.id !== videoId
                    )
                  }))
                }
                loadMoreUploads={this.loadMoreVideos}
              />
            </div>
          )}
          {section === 2 && (
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
                    const selectedVideoArray = selected.map(video => video.id);
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
        </main>
        <footer>
          {section === 0 ? (
            <Button
              style={{ marginRight: '0.7rem' }}
              transparent
              onClick={onHide}
            >
              Cancel
            </Button>
          ) : (
            <Button
              style={{ marginRight: '0.7rem' }}
              transparent
              onClick={this.handlePrev}
            >
              Prev
            </Button>
          )}
          {section === 2 ? (
            <Button primary disabled={isUploading} onClick={this.handleFinish}>
              Finish
            </Button>
          ) : (
            <Button
              primary
              type="submit"
              disabled={
                (section === 0 &&
                  (stringIsEmpty(title) ||
                    titleExceedsCharLimit ||
                    descriptionExceedsCharLimit)) ||
                (section === 1 && this.state.selectedVideos.length === 0)
              }
              onClick={this.handleNext}
            >
              Next
            </Button>
          )}
        </footer>
      </Modal>
    );
  }

  renderTitle = () => {
    const currentSection = this.state.section;
    switch (currentSection) {
      case 0:
        return 'Add Playlist';
      case 1:
        return 'Add videos to your playlist';
      case 2:
        return 'Click and drag videos into the order that you would like them to appear';
      default:
        return 'Error';
    }
  };

  handlePrev = () => {
    const currentSection = this.state.section;
    const prevSection = Math.max(currentSection - 1, 0);
    this.setState({ section: prevSection });
  };

  handleNext = () => {
    const currentSection = this.state.section;
    const nextSection = Math.min(currentSection + 1, 2);
    this.setState({ section: nextSection });
  };

  handleFinish = async() => {
    const { dispatch, postPlaylist, onHide } = this.props;
    const { title, description, selectedVideos } = this.state;
    this.setState({ isUploading: true });
    const data = await uploadPlaylist({
      dispatch,
      title: finalizeEmoji(title),
      description: finalizeEmoji(description),
      selectedVideos: selectedVideos.map(video => video.id)
    });
    await postPlaylist(data);
    onHide();
  };

  loadMoreVideos = async() => {
    const { allVideos, searchedVideos, searchText } = this.state;
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedVideos
      });
      this.setState(state => ({
        searchedVideos: state.searchedVideos.concat(results),
        searchLoadMoreButton: loadMoreButton
      }));
    } else {
      const { results, loadMoreButton } = await loadUploads({
        type: 'video',
        limit: 18,
        contentId: allVideos[allVideos.length - 1].id
      });
      this.setState(state => ({
        allVideos: state.allVideos.concat(results),
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
  dispatch => ({ dispatch })
)(DragDropContext(HTML5Backend)(AddPlaylistModal));
