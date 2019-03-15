import React, { useEffect, useRef, useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
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
import { objectify } from 'helpers';
import { css } from 'emotion';
import { connect } from 'react-redux';

AddPlaylistModal.propTypes = {
  dispatch: PropTypes.func,
  existingVideoIds: PropTypes.array,
  focusPlaylistPanelAfterUpload: PropTypes.func,
  onHide: PropTypes.func,
  postPlaylist: PropTypes.func,
  title: PropTypes.string
};

function AddPlaylistModal({
  dispatch,
  existingVideoIds = [],
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const { handleSearch, searching, searchText } = useSearch({
    onSearch: searchVideo,
    onClear: () => setSearchedVideos([])
  });
  const playlistVideoObjects = useRef({});
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadVideos();
    async function loadVideos() {
      const { results: loadedVideos, loadMoreButton } = await loadUploads({
        type: 'video',
        limit: 18,
        excludeContentIds: existingVideoIds
      });
      if (mounted.current) {
        playlistVideoObjects.current = objectify(loadedVideos);
        setAllVideos(loadedVideos.map(video => video.id));
        setLoadMoreButton(loadMoreButton);
      }
    }
    return function cleanUp() {
      mounted.current = false;
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
              onChange={handleSearch}
            />
            {searching ? (
              <Loading />
            ) : (
              <SelectUploadsForm
                contentObjs={playlistVideoObjects.current}
                uploads={
                  !stringIsEmpty(searchText) ? searchedVideos : allVideos
                }
                selectedUploads={selectedVideos}
                loadingMore={loadingMore}
                loadMoreButton={
                  !stringIsEmpty(searchText)
                    ? searchLoadMoreButton
                    : loadMoreButton
                }
                onSelect={selectedVideoId =>
                  setSelectedVideos(selectedVideos =>
                    selectedVideos.concat(selectedVideoId)
                  )
                }
                onDeselect={deselectedVideoId =>
                  setSelectedVideos(
                    selectedVideos.filter(
                      videoId => videoId !== deselectedVideoId
                    )
                  )
                }
                loadMoreUploads={loadMoreVideos}
              />
            )}
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
            {selectedVideos.map(videoId => (
              <SortableThumb
                key={videoId}
                video={playlistVideoObjects.current[videoId]}
                onMove={({ sourceId, targetId }) => {
                  let selected = [...selectedVideos];
                  const sourceIndex = selected.indexOf(sourceId);
                  const targetIndex = selected.indexOf(targetId);
                  selected.splice(sourceIndex, 1);
                  selected.splice(targetIndex, 0, sourceId);
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
        selectedVideos
      });
      await postPlaylist(data);
      focusPlaylistPanelAfterUpload?.();
      onHide();
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMoreVideos() {
    setLoadingMore(true);
    if (!stringIsEmpty(searchText)) {
      const { results: loadedVideos, loadMoreButton } = await searchContent({
        filter: 'video',
        searchText,
        shownResults: searchedVideos.map(
          videoId => playlistVideoObjects.current[videoId]
        )
      });
      playlistVideoObjects.current = {
        ...playlistVideoObjects.current,
        ...objectify(loadedVideos)
      };
      setSearchedVideos(
        searchedVideos.concat(loadedVideos.map(video => video.id))
      );
      setLoadingMore(false);
      setSearchLoadMoreButton(loadMoreButton);
    } else {
      const { results: loadedVideos, loadMoreButton } = await loadUploads({
        type: 'video',
        limit: 18,
        contentId: allVideos[allVideos.length - 1]
      });
      playlistVideoObjects.current = {
        ...playlistVideoObjects.current,
        ...objectify(loadedVideos)
      };
      setAllVideos(allVideos.concat(loadedVideos.map(video => video.id)));
      setLoadingMore(false);
      setLoadMoreButton(loadMoreButton);
    }
  }

  async function searchVideo(text) {
    const { results: searchResults, loadMoreButton } = await searchContent({
      filter: 'video',
      searchText: text
    });
    playlistVideoObjects.current = {
      ...playlistVideoObjects.current,
      ...objectify(searchResults)
    };
    setSearchedVideos(searchResults.map(video => video.id));
    setSearchLoadMoreButton(loadMoreButton);
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(DragDropContext(HTML5Backend)(AddPlaylistModal));
