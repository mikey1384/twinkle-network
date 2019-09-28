import VIDEO from '../constants/Video';

export const openReorderFeaturedPlaylists = () => ({
  type: VIDEO.OPEN_REORDER_PINNED_PL_MODAL
});

export const onOpenSelectPlaylistsToPinModal = data => ({
  type: VIDEO.OPEN_SELECT_PL_TO_PIN_MODAL,
  data
});

export const postPlaylist = data => ({
  type: VIDEO.UPLOAD_PLAYLIST,
  data
});

export const setRewardLevel = ({ videoId, rewardLevel }) => ({
  type: VIDEO.SET_REWARD_LEVEL,
  videoId,
  rewardLevel
});

export const setSearchedPlaylists = ({ playlists, loadMoreButton }) => ({
  type: VIDEO.SET_SEARCHED_PLAYLISTS,
  playlists,
  loadMoreButton
});
