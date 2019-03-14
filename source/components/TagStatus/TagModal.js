import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { addVideoToPlaylists, searchContent } from 'helpers/requestHelpers';
import { hashify } from 'helpers/stringHelpers';
import { connect } from 'react-redux';

TagModal.propTypes = {
  currentPlaylists: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  videoId: PropTypes.number.isRequired,
  onAddPlaylist: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

function TagModal({
  currentPlaylists,
  dispatch,
  title,
  onAddPlaylist,
  onHide,
  onSubmit,
  videoId
}) {
  const [addPlaylistModalShown, setAddPlaylistModalShown] = useState(false);
  const [notFoundMessageShown, setNotFoundMessageShown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [disabled, setDisabled] = useState(false);

  return (
    <Modal onHide={onHide}>
      <header>{title}</header>
      <main>
        <TagForm
          title="Search Playlists"
          itemLabel="title"
          searchResults={searchResults}
          filter={result => currentPlaylists.indexOf(result.id) === -1}
          onSearch={onSearchPlaylists}
          onClear={onClearSearchResults}
          onAddItem={playlist => {
            setAddPlaylistModalShown(false);
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
        >
          {notFoundMessageShown && (
            <div style={{ marginTop: '0.5rem' }}>
              No playlists were found.{' '}
              <a onClick={() => setAddPlaylistModalShown(true)}>
                Create a new playlist
              </a>
            </div>
          )}
        </TagForm>
        {addPlaylistModalShown && (
          <AddPlaylistModal
            existingVideoIds={[videoId]}
            postPlaylist={addPlaylist}
            onHide={() => setAddPlaylistModalShown(false)}
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
          primary
          onClick={handleSubmit}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  function addPlaylist(playlist) {
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
      dispatch,
      videoId,
      playlistIds: selectedPlaylists.map(playlist => playlist.id)
    });
    setSearchText('');
    onSubmit(selectedPlaylists);
  }

  async function onSearchPlaylists(text) {
    const { results } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 5
    });
    setSearchText(text);
    setSearchResults(results);
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(TagModal);
