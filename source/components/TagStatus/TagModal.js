import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { capitalize, hashify } from 'helpers/stringHelpers';
import { useAppContext } from 'contexts';

TagModal.propTypes = {
  currentPlaylists: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  videoId: PropTypes.number.isRequired,
  onAddPlaylist: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function TagModal({
  currentPlaylists,
  title,
  onAddPlaylist,
  onHide,
  onSubmit,
  videoId
}) {
  const {
    requestHelpers: { addVideoToPlaylists, searchContent }
  } = useAppContext();
  const [addPlaylistModalShown, setAddPlaylistModalShown] = useState(false);
  const [notFoundMessageShown, setNotFoundMessageShown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const InputRef = useRef(null);
  const searchTextRef = useRef('');
  const dropdownFooter = useMemo(
    () =>
      notFoundMessageShown ? (
        <a
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => {
            setSearchResults([]);
            setAddPlaylistModalShown(true);
          }}
        >
          {`Create a new playlist titled "${capitalize(searchText)}"`}
        </a>
      ) : null,
    [notFoundMessageShown, searchText]
  );

  return (
    <Modal onHide={onHide}>
      <header>{title}</header>
      <main>
        <TagForm
          title="Search Playlists"
          subTitle="(e.g., crash course, story of the world)"
          dropdownFooter={dropdownFooter}
          inputRef={InputRef}
          itemLabel="title"
          searchResults={searchResults}
          filter={result => !currentPlaylists.includes(result.id)}
          onSearch={onSearchPlaylists}
          onClear={onClearSearchResults}
          onAddItem={playlist => {
            setAddPlaylistModalShown(false);
            setNotFoundMessageShown(false);
            setSelectedPlaylists(selectedPlaylists.concat([playlist]));
          }}
          onNotFound={({ messageShown }) =>
            setNotFoundMessageShown(messageShown)
          }
          onRemoveItem={onRemovePlaylist}
          onSubmit={selectedPlaylists.length > 0 && handleSubmit}
          renderDropdownLabel={item => <span>{item.title}</span>}
          renderTagLabel={label => hashify(label)}
          searchPlaceholder="Search for playlists here..."
          selectedItems={selectedPlaylists}
        />
        {addPlaylistModalShown && (
          <AddPlaylistModal
            modalOverModal
            existingVideoIds={[videoId]}
            onUploadPlaylist={handleAddPlaylist}
            onHide={() => {
              setNotFoundMessageShown(false);
              setAddPlaylistModalShown(false);
              InputRef.current.focus();
            }}
            title={searchText}
          />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={disabled || selectedPlaylists.length === 0}
          color="blue"
          onClick={handleSubmit}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  function handleAddPlaylist(playlist) {
    onAddPlaylist({
      videoIds: playlist?.playlist
        ?.map(video => video.videoId)
        ?.filter(id => id !== videoId),
      playlistId: playlist.id,
      playlistTitle: playlist.title
    });
    setAddPlaylistModalShown(false);
    setNotFoundMessageShown(false);
    setSelectedPlaylists(selectedPlaylists.concat([playlist]));
  }

  function onClearSearchResults() {
    setSearchResults([]);
  }

  function onRemovePlaylist(playlistId) {
    setSelectedPlaylists(
      selectedPlaylists.filter(playlist => playlist.id !== playlistId)
    );
  }

  async function handleSubmit() {
    setDisabled(true);
    await addVideoToPlaylists({
      videoId,
      playlistIds: selectedPlaylists.map(playlist => playlist.id)
    });
    setSearchText('');
    onSubmit(selectedPlaylists);
  }

  async function onSearchPlaylists(text) {
    searchTextRef.current = text;
    const { results, searchText } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 5
    });
    if (searchTextRef.current === searchText) {
      setSearchText(searchText);
      setSearchResults(results);
    }
  }
}
