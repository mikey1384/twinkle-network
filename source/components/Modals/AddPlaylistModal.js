import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
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

AddPlaylistModal.propTypes = {
  dispatch: PropTypes.func,
  excludeVideoIds: PropTypes.array,
  focusPlaylistPanelAfterUpload: PropTypes.func,
  onHide: PropTypes.func,
  postPlaylist: PropTypes.func,
  title: PropTypes.string
};

function AddPlaylistModal({
  dispatch,
  excludeVideoIds = [],
  focusPlaylistPanelAfterUpload,
  onHide,
  postPlaylist,
  title: initialTitle = ''
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [section, setSection] = useState(0);
  const [title, setTitle] = useState(
    initialTitle?.charAt(0).toUpperCase() + initialTitle?.slice(1)
  );
  const [description, setDescription] = useState('');
  const [allVideos, setAllVideos] = useState([]);
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const [searchText, setSearchText] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadVideos() {
      const { results, loadMoreButton } = await loadUploads({
        type: 'video',
        limit: 18,
        excludeContentIds: excludeVideoIds
      });
      if (mounted) {
        setAllVideos(results);
        setLoadMoreButton(loadMoreButton);
      }
    }
    loadVideos();
    return () => {
      clearTimeout(timerRef.current);
      mounted = false;
    };
  }, []);
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
      <header>{renderTitle()}</header>
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
                autoFocus
                placeholder="Enter Playlist Title"
                value={title}
                onChange={text => setTitle(text)}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setTitle(addEmoji(event.target.value));
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
                onChange={event => setDescription(event.target.value)}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    setDescription(addEmoji(event.target.value));
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
              onChange={onVideoSearchInput}
            />
            <SelectUploadsForm
              uploads={!stringIsEmpty(searchText) ? searchedVideos : allVideos}
              selectedUploads={selectedVideos}
              loadMoreButton={
                !stringIsEmpty(searchText)
                  ? searchLoadMoreButton
                  : loadMoreButton
              }
              onSelect={video =>
                setSelectedVideos(selectedVideos.concat([video]))
              }
              onDeselect={videoId =>
                setSelectedVideos(
                  selectedVideos.filter(video => video.id !== videoId)
                )
              }
              loadMoreUploads={loadMoreVideos}
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
                  setSelectedVideos(selected);
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
            onClick={handlePrev}
          >
            Prev
          </Button>
        )}
        {section === 2 ? (
          <Button primary disabled={isUploading} onClick={handleFinish}>
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
              (section === 1 && selectedVideos.length === 0)
            }
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </footer>
    </Modal>
  );

  function renderTitle() {
    switch (section) {
      case 0:
        return 'Add Playlist';
      case 1:
        return 'Add videos to your playlist';
      case 2:
        return 'Click and drag videos into the order that you would like them to appear';
      default:
        return 'Error';
    }
  }

  function handlePrev() {
    const prevSection = Math.max(section - 1, 0);
    setSection(prevSection);
  }

  function handleNext() {
    const nextSection = Math.min(section + 1, 2);
    setSection(nextSection);
  }

  async function handleFinish() {
    setIsUploading(true);
    try {
      const data = await uploadPlaylist({
        dispatch,
        title: finalizeEmoji(title),
        description: finalizeEmoji(description),
        selectedVideos: selectedVideos.map(video => video.id)
      });
      await postPlaylist(data);
      focusPlaylistPanelAfterUpload?.();
      onHide();
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMoreVideos() {
    if (!stringIsEmpty(searchText)) {
      const { results, loadMoreButton } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedVideos
      });
      setSearchedVideos(searchedVideos.concat(results));
      setSearchLoadMoreButton(loadMoreButton);
    } else {
      const { results, loadMoreButton } = await loadUploads({
        type: 'video',
        limit: 18,
        contentId: allVideos[allVideos.length - 1].id
      });
      setAllVideos(allVideos.concat(results));
      setLoadMoreButton(loadMoreButton);
    }
  }

  function onVideoSearchInput(text) {
    clearTimeout(timerRef.current);
    setSearchText(text);
    timerRef.current = setTimeout(() => searchVideo(text), 300);
  }

  async function searchVideo(text) {
    const { results: searchedVideos, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    setSearchedVideos(searchedVideos);
    setSearchLoadMoreButton(loadMoreButton);
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(DragDropContext(HTML5Backend)(AddPlaylistModal));
