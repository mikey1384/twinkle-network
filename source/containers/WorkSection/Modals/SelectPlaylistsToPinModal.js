import React, { useEffect, useState } from 'react';
import { useSearch } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import CheckListGroup from 'components/CheckListGroup';
import {
  loadMorePlaylistList,
  changePinnedPlaylists
} from 'redux/actions/VideoActions';
import FilterBar from 'components/FilterBar';
import Banner from 'components/Banner';
import SearchInput from 'components/Texts/SearchInput';
import Loading from 'components/Loading';
import { searchContent } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

SelectPlaylistsToPinModal.propTypes = {
  changePinnedPlaylists: PropTypes.func.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  loadMorePlaylist: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  playlistsToPin: PropTypes.array.isRequired,
  pinnedPlaylists: PropTypes.array.isRequired,
  selectedPlaylists: PropTypes.array.isRequired
};

function SelectPlaylistsToPinModal({
  changePinnedPlaylists,
  loadMoreButton,
  loadMorePlaylist,
  onHide,
  pinnedPlaylists,
  playlistsToPin,
  selectedPlaylists: initialSelectedPlaylists
}) {
  const [selectTabActive, setSelectTabActive] = useState(true);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [searchedPlaylists, setSearchedPlaylists] = useState([]);
  const [playlistsToPinObject, setPlaylistsToPinObject] = useState({});
  const [pinnedPlaylistsObject, setPinnedPlaylistsObject] = useState({});
  const [searchedPlaylistsObject, setSearchedPlaylistsObject] = useState({});
  const [disabled, setDisabled] = useState(false);
  const { handleSearch, searchText, searching } = useSearch({
    onSearch: handlePlaylistSearch,
    onClear: () => setSearchedPlaylists([])
  });

  useEffect(() => {
    setSelectedPlaylists(initialSelectedPlaylists);
    setPinnedPlaylistsObject(
      pinnedPlaylists.reduce(
        (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
        {}
      )
    );
  }, []);
  useEffect(() => {
    setPlaylistsToPinObject(
      playlistsToPin.reduce(
        (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
        {}
      )
    );
  }, [playlistsToPin]);
  const lastPlaylistId = playlistsToPin[playlistsToPin.length - 1].id;
  const playlistObjects = {
    ...pinnedPlaylistsObject,
    ...playlistsToPinObject,
    ...searchedPlaylistsObject
  };
  return (
    <Modal onHide={onHide}>
      <header>Select up to 5 playlists</header>
      <main style={{ paddingTop: 0 }}>
        {selectedPlaylists.length > 5 && (
          <Banner love>Please limit your selection to 5 playlists</Banner>
        )}
        <FilterBar>
          <nav
            className={selectTabActive ? 'active' : ''}
            onClick={() => setSelectTabActive(true)}
            style={{ cursor: 'pointer' }}
          >
            Select
          </nav>
          <nav
            className={selectTabActive ? '' : 'active'}
            onClick={() => setSelectTabActive(false)}
            style={{ cursor: 'pointer' }}
          >
            Selected
          </nav>
        </FilterBar>
        <div style={{ marginTop: '1rem', width: '100%' }}>
          {selectTabActive && (
            <>
              <SearchInput
                autoFocus
                placeholder="Search for playlists to pin"
                value={searchText}
                onChange={handleSearch}
              />
              {searching ? (
                <Loading />
              ) : (
                <CheckListGroup
                  style={{ marginTop: '1rem' }}
                  inputType="checkbox"
                  onSelect={handleSelect}
                  listItems={renderListItems()}
                />
              )}
              {loadMoreButton && !searchText && (
                <Button
                  style={{ marginTop: '2rem', width: '100%' }}
                  transparent
                  onClick={() => loadMorePlaylist(lastPlaylistId)}
                >
                  Load More
                </Button>
              )}
              {playlistsToPin.length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '8rem',
                    justifyContent: 'center'
                  }}
                >
                  <h3>No Playlists</h3>
                </div>
              )}
            </>
          )}
          {!selectTabActive && (
            <>
              <CheckListGroup
                inputType="checkbox"
                onSelect={handleDeselect}
                listItems={selectedPlaylists.map(playlistId => ({
                  label: playlistObjects[playlistId],
                  checked: true
                }))}
              />
              {selectedPlaylists.length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '8rem',
                    justifyContent: 'center'
                  }}
                >
                  <h3>No Playlist Selected</h3>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          primary
          onClick={handleSubmit}
          disabled={
            isEqual(selectedPlaylists, initialSelectedPlaylists) ||
            selectedPlaylists.length > 5 ||
            disabled
          }
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  async function handlePlaylistSearch(text) {
    const { results } = await searchContent({
      filter: 'playlist',
      searchText: text
    });
    setSearchedPlaylists(results);
    setSearchedPlaylistsObject(
      results.reduce(
        (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
        {}
      )
    );
  }

  function handleSelect(index) {
    const playlists = searchText ? searchedPlaylists : playlistsToPin;
    let playlistId = playlists[index].id;
    setSelectedPlaylists(
      selectedPlaylists.indexOf(playlistId) === -1
        ? [playlistId].concat(selectedPlaylists)
        : selectedPlaylists.filter(id => id !== playlistId)
    );
  }

  function handleDeselect(index) {
    let playlistIndex = 0;
    const newSelectedPlaylists = selectedPlaylists.filter(playlist => {
      return playlistIndex++ !== index;
    });
    setSelectedPlaylists(newSelectedPlaylists);
  }

  async function handleSubmit() {
    setDisabled(true);
    await changePinnedPlaylists(selectedPlaylists);
    onHide();
  }

  function renderListItems() {
    const playlists = searchText ? searchedPlaylists : playlistsToPin;
    return playlists.map(playlist => {
      return {
        label: playlist.title,
        checked: selectedPlaylists.indexOf(playlist.id) !== -1
      };
    });
  }
}

export default connect(
  null,
  {
    loadMorePlaylist: loadMorePlaylistList,
    changePinnedPlaylists
  }
)(SelectPlaylistsToPinModal);
