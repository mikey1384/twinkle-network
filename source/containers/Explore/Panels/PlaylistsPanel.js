import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PlaylistCarousel from '../PlaylistCarousel';
import SectionPanel from 'components/SectionPanel';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { getMorePlaylists } from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { loadPlaylists, searchContent } from 'helpers/requestHelpers';

PlaylistsPanel.propTypes = {
  buttonGroup: PropTypes.func,
  buttonGroupShown: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isSearching: PropTypes.bool,
  getMorePlaylists: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMoreButton: PropTypes.bool,
  onSearch: PropTypes.func,
  playlists: PropTypes.array.isRequired,
  searchQuery: PropTypes.string,
  title: PropTypes.string.isRequired,
  userId: PropTypes.number
};

function PlaylistsPanel({
  buttonGroupShown = true,
  buttonGroup,
  getMorePlaylists,
  isSearching,
  innerRef,
  loaded,
  loadMoreButton,
  onSearch,
  playlists,
  searchQuery,
  title = 'All Playlists',
  userId
}) {
  return (
    <SectionPanel
      innerRef={innerRef}
      title={title}
      button={buttonGroupShown ? buttonGroup() : null}
      searchPlaceholder="Search playlists"
      emptyMessage="No Playlists"
      isEmpty={playlists.length === 0}
      loaded={loaded}
      loadMoreButtonShown={!isSearching && loadMoreButton}
      loadMore={handleLoadMorePlaylists}
      isSearching={isSearching}
      onSearch={onSearch}
      searchQuery={searchQuery}
    >
      {playlists.map((playlist, index) => {
        return (
          <PlaylistCarousel
            {...playlist}
            key={playlist.id}
            arrayIndex={index}
            userIsUploader={userId === playlist.uploaderId}
            showAllButton={playlist.showAllButton}
          />
        );
      })}
    </SectionPanel>
  );

  async function handleLoadMorePlaylists() {
    const { results, loadMoreButton } = stringIsEmpty(searchQuery)
      ? await loadPlaylists({ shownPlaylists: playlists })
      : await searchContent({
          filter: 'playlist',
          shownResults: playlists,
          searchText: searchQuery,
          limit: 3
        });
    getMorePlaylists({
      playlists: results,
      isSearch: !!searchQuery,
      loadMoreButton
    });
  }
}

export default connect(
  null,
  { getMorePlaylists }
)(withRouter(PlaylistsPanel));
