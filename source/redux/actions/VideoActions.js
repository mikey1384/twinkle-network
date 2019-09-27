import VIDEO from '../constants/Video';

export const onLoadPlaylists = ({ playlists, loadMoreButton }) => ({
  type: VIDEO.LOAD_PLAYLISTS,
  playlists,
  loadMoreButton
});

export const getMorePlaylists = ({ playlists, isSearch, loadMoreButton }) => ({
  type: VIDEO.LOAD_MORE_PLAYLISTS,
  playlists,
  isSearch,
  loadMoreButton
});

export const likeVideo = ({ likes, videoId }) => ({
  type: VIDEO.LIKE,
  likes,
  videoId
});

export const onLoadMorePlaylistList = data => ({
  type: VIDEO.LOAD_MORE_PL_LIST,
  data
});

export const openAddPlaylistModal = () => ({
  type: VIDEO.OPEN_PLAYLIST_MODAL
});

export const openAddVideoModal = () => ({
  type: VIDEO.OPEN_MODAL
});

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

export const uploadVideo = data => ({
  type: VIDEO.UPLOAD,
  data
});
