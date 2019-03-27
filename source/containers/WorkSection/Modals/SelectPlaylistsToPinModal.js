import React, { useEffect, useRef, useState } from 'react';
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
import { stringIsEmpty } from 'helpers/stringHelpers';
import { searchContent, uploadFeaturedPlaylists } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

SelectPlaylistsToPinModal.propTypes = {
  changePinnedPlaylists: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  loadMorePlaylist: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  playlistsToPin: PropTypes.array.isRequired,
  pinnedPlaylists: PropTypes.array.isRequired,
  selectedPlaylists: PropTypes.array.isRequired
};

function SelectPlaylistsToPinModal({
  changePinnedPlaylists,
  dispatch,
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchLoadMoreButton, setSearchLoadMoreButton] = useState(false);
  const playlistsToPinObjectRef = useRef({});
  const pinnedPlaylistsObjectRef = useRef({});
  const searchedPlaylistsObjectRef = useRef({});
  const { handleSearch, searchText, searching } = useSearch({
    onSearch: handlePlaylistSearch,
    onClear: () => setSearchedPlaylists([])
  });
  useEffect(() => {
    pinnedPlaylistsObjectRef.current = pinnedPlaylists.reduce(
      (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
      {}
    );
    setSelectedPlaylists(initialSelectedPlaylists);
  }, []);
  useEffect(() => {
    playlistsToPinObjectRef.current = playlistsToPin.reduce(
      (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
      {}
    );
  }, [playlistsToPin]);

  const playlistObjects = {
    ...pinnedPlaylistsObjectRef.current,
    ...playlistsToPinObjectRef.current,
    ...searchedPlaylistsObjectRef.current
  };
  const lastPlaylistId = playlistsToPin[playlistsToPin.length - 1].id;
  const displayedLoadMoreButton = stringIsEmpty(searchText)
    ? loadMoreButton
    : searchLoadMoreButton;

  return (
    <Modal onHide={onHide}>
      <header>Select up to 5 playlists</header>
      <main style={{ paddingTop: 0 }}>
        {selectedPlaylists.length > 5 && (
          <Banner>Please limit your selection to 5 playlists</Banner>
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
              {displayedLoadMoreButton && (
                <Button
                  style={{ marginTop: '2rem', width: '100%' }}
                  transparent
                  onClick={() => handleLoadMore(lastPlaylistId)}
                  disabled={loadingMore}
                >
                  Load More
                </Button>
              )}
              {playlistsToPin.length === 0 && (
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '10rem',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    justifyContent: 'center'
                  }}
                >
                  No Playlists
                </p>
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
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '10rem',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    justifyContent: 'center'
                  }}
                >
                  No Playlists Selected
                </p>
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
          color="blue"
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

  async function handleLoadMore(lastPlaylistId) {
    setLoadingMore(true);
    if (stringIsEmpty(searchText)) {
      await loadMorePlaylist(lastPlaylistId);
      return setLoadingMore(false);
    }
    const { loadMoreButton: loadMoreShown, results } = await searchContent({
      limit: 10,
      filter: 'playlist',
      searchText,
      shownResults: searchedPlaylists
    });
    searchedPlaylistsObjectRef.current = {
      ...searchedPlaylistsObjectRef.current,
      ...results.reduce(
        (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
        {}
      )
    };
    setSearchedPlaylists(searchedPlaylists =>
      searchedPlaylists.concat(results)
    );
    setLoadingMore(false);
    setSearchLoadMoreButton(loadMoreShown);
  }

  async function handlePlaylistSearch(text) {
    const { loadMoreButton: loadMoreShown, results } = await searchContent({
      limit: 10,
      filter: 'playlist',
      searchText: text
    });
    searchedPlaylistsObjectRef.current = results.reduce(
      (prev, playlist) => ({ ...prev, [playlist.id]: playlist.title }),
      {}
    );
    setSearchedPlaylists(results);
    setSearchLoadMoreButton(loadMoreShown);
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
    const newFeaturedPlaylists = await uploadFeaturedPlaylists({
      dispatch,
      selectedPlaylists
    });
    changePinnedPlaylists(newFeaturedPlaylists);
    onHide();
  }

  function renderListItems() {
    const playlists = searchText ? searchedPlaylists : playlistsToPin;
    return playlists.map(playlist => ({
      label: playlist.title,
      checked: selectedPlaylists.indexOf(playlist.id) !== -1
    }));
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch,
    loadMorePlaylist: lastPlaylistId =>
      dispatch(loadMorePlaylistList(lastPlaylistId)),
    changePinnedPlaylists: selectedPlaylists =>
      dispatch(changePinnedPlaylists(selectedPlaylists))
  })
)(SelectPlaylistsToPinModal);
