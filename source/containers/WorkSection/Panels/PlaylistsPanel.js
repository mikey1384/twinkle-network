import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PlaylistCarousel from '../PlaylistCarousel';
import SectionPanel from 'components/SectionPanel';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { getMorePlaylists } from 'redux/actions/VideoActions';
import { connect } from 'react-redux';
import { loadPlaylists, searchContent } from 'helpers/requestHelpers';

class PlaylistsPanel extends Component {
  static propTypes = {
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    innerRef: PropTypes.func,
    isSearching: PropTypes.bool,
    getMorePlaylists: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool,
    location: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    playlists: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number
  };

  render() {
    const {
      innerRef,
      isSearching,
      loadMoreButton,
      playlists,
      userId,
      buttonGroupShown = true,
      buttonGroup,
      loaded,
      onSearch,
      searchQuery,
      title = 'All Playlists'
    } = this.props;
    let buttonGroupElement = buttonGroupShown ? buttonGroup() : null;
    return (
      <SectionPanel
        innerRef={innerRef}
        title={title}
        button={buttonGroupElement}
        searchPlaceholder="Search playlists"
        emptyMessage="No Playlists"
        isEmpty={playlists.length === 0}
        loaded={loaded}
        loadMoreButtonShown={!isSearching && loadMoreButton}
        loadMore={this.loadMorePlaylists}
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
  }

  loadMorePlaylists = async() => {
    const { playlists, getMorePlaylists, searchQuery } = this.props;
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
  };
}

export default connect(
  null,
  { getMorePlaylists }
)(withRouter(PlaylistsPanel));
