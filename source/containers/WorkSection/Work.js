import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ChallengesPanel from './Panels/ChallengesPanel';
import PlaylistsPanel from './Panels/PlaylistsPanel';
import ButtonGroup from 'components/Buttons/ButtonGroup';
import SelectPlaylistsToPinModal from './Modals/SelectPlaylistsToPinModal';
import ReorderFeaturedPlaylists from './Modals/ReorderFeaturedPlaylists';
import { loadFeaturedContents } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import {
  closeReorderFeaturedPlaylists,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylists,
  openReorderFeaturedPlaylists,
  openSelectPlaylistsToPinModal
} from 'redux/actions/VideoActions';

Work.propTypes = {
  canPinPlaylists: PropTypes.bool,
  closeReorderFeaturedPlaylists: PropTypes.func.isRequired,
  closeSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  getPinnedPlaylists: PropTypes.func.isRequired,
  loadMorePlaylistsToPinButton: PropTypes.bool.isRequired,
  openReorderFeaturedPlaylists: PropTypes.func.isRequired,
  openSelectPlaylistsToPinModal: PropTypes.func.isRequired,
  featuredPlaylists: PropTypes.array.isRequired,
  playlistsLoaded: PropTypes.bool.isRequired,
  playlistsToPin: PropTypes.array.isRequired,
  reorderFeaturedPlaylistsShown: PropTypes.bool.isRequired,
  selectPlaylistsToPinModalShown: PropTypes.bool.isRequired,
  userId: PropTypes.number
};

function Work({
  canPinPlaylists,
  closeReorderFeaturedPlaylists,
  closeSelectPlaylistsToPinModal,
  getPinnedPlaylists,
  loadMorePlaylistsToPinButton,
  openReorderFeaturedPlaylists,
  openSelectPlaylistsToPinModal,
  featuredPlaylists,
  playlistsLoaded,
  playlistsToPin,
  reorderFeaturedPlaylistsShown,
  selectPlaylistsToPinModalShown,
  userId
}) {
  const [featuredChallenges, setFeaturedChallenges] = useState([]);
  const [challengesLoaded, setChallengesLoaded] = useState(false);
  useEffect(() => {
    init();
    async function init() {
      const { challenges, playlists } = await loadFeaturedContents();
      setFeaturedChallenges(challenges);
      setChallengesLoaded(true);
      getPinnedPlaylists(playlists);
    }
  }, []);

  const menuButtons = [
    {
      label: 'Select Playlists',
      onClick: openSelectPlaylistsToPinModal,
      buttonClass: 'snow'
    }
  ];
  if (featuredPlaylists.length > 0) {
    menuButtons.push({
      label: 'Reorder Playlists',
      onClick: openReorderFeaturedPlaylists,
      buttonClass: 'snow'
    });
  }

  return (
    <div>
      <ChallengesPanel
        challenges={featuredChallenges}
        loaded={challengesLoaded}
        onSelectedChallengesSubmit={selectedChallenges =>
          setFeaturedChallenges(selectedChallenges)
        }
      />
      <PlaylistsPanel
        buttonGroupShown={!!canPinPlaylists}
        buttonGroup={() => (
          <ButtonGroup style={{ marginLeft: 'auto' }} buttons={menuButtons} />
        )}
        title="Featured Playlists"
        userId={userId}
        playlists={featuredPlaylists}
        loaded={playlistsLoaded}
      />
      {selectPlaylistsToPinModalShown && (
        <SelectPlaylistsToPinModal
          playlistsToPin={playlistsToPin}
          pinnedPlaylists={featuredPlaylists}
          selectedPlaylists={featuredPlaylists.map(playlist => {
            return playlist.id;
          })}
          loadMoreButton={loadMorePlaylistsToPinButton}
          onHide={closeSelectPlaylistsToPinModal}
        />
      )}
      {reorderFeaturedPlaylistsShown && (
        <ReorderFeaturedPlaylists
          pinnedPlaylists={featuredPlaylists}
          playlistIds={featuredPlaylists.map(playlist => playlist.id)}
          onHide={closeReorderFeaturedPlaylists}
        />
      )}
    </div>
  );
}

export default connect(
  state => ({
    canPinPlaylists: state.UserReducer.canPinPlaylists,
    loadMorePlaylistsToPinButton:
      state.VideoReducer.loadMorePlaylistsToPinButton,
    featuredPlaylists: state.VideoReducer.pinnedPlaylists,
    playlistsLoaded: state.VideoReducer.pinnedPlaylistsLoaded,
    playlistsToPin: state.VideoReducer.playlistsToPin,
    reorderFeaturedPlaylistsShown:
      state.VideoReducer.reorderFeaturedPlaylistsShown,
    selectPlaylistsToPinModalShown:
      state.VideoReducer.selectPlaylistsToPinModalShown,
    userId: state.UserReducer.userId
  }),
  {
    closeReorderFeaturedPlaylists,
    closeSelectPlaylistsToPinModal,
    getPinnedPlaylists,
    openReorderFeaturedPlaylists,
    openSelectPlaylistsToPinModal
  }
)(Work);
